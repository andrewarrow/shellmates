const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');

// Database setup
const dbPath = path.join(__dirname, '../../data/traffic.db');
const migrationsPath = path.join(__dirname, './migrations');
const seedsPath = path.join(__dirname, './seeds');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Migration system
function getMigrationFiles() {
  return fs.readdirSync(migrationsPath)
    .filter(file => file.endsWith('.js'))
    .sort(); // Sort alphabetically to ensure order
}

function getCompletedMigrations() {
  // Create migrations table if it doesn't exist
  sqlite.prepare(
    `CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();
  
  // Get list of completed migrations
  const completed = sqlite.prepare('SELECT name FROM migrations').all();
  return completed.map(row => row.name);
}

function runMigration(migrationName) {
  const migrationPath = path.join(migrationsPath, migrationName);
  const migration = require(migrationPath);
  
  // Begin transaction
  const transaction = sqlite.transaction(() => {
    // Run up function
    migration.up(sqlite);
    
    // Mark migration as complete
    sqlite.prepare('INSERT INTO migrations (name) VALUES (?)').run(migrationName);
  });
  
  // Execute transaction
  transaction();
  console.log(`Applied migration: ${migrationName}`);
}

function migrate() {
  const allMigrations = getMigrationFiles();
  const completedMigrations = getCompletedMigrations();
  
  // Find migrations that need to be applied
  const pendingMigrations = allMigrations.filter(migration => 
    !completedMigrations.includes(migration)
  );
  
  // Apply pending migrations
  if (pendingMigrations.length > 0) {
    console.log(`Applying ${pendingMigrations.length} migrations...`);
    pendingMigrations.forEach(runMigration);
    console.log('Migrations completed.');
  } else {
    console.log('No pending migrations.');
  }
}

// Seed system
function getSeedFiles() {
  if (!fs.existsSync(seedsPath)) return [];
  return fs.readdirSync(seedsPath)
    .filter(file => file.endsWith('.js'))
    .sort();
}

function runSeed(seedName) {
  const seedPath = path.join(seedsPath, seedName);
  const seed = require(seedPath);
  
  // Run seed function
  seed.run(sqlite);
  console.log(`Applied seed: ${seedName}`);
}

function seed() {
  const seedFiles = getSeedFiles();
  
  if (seedFiles.length > 0) {
    console.log(`Running ${seedFiles.length} seed files...`);
    //seedFiles.forEach(runSeed);
    console.log('Seeding completed.');
  } else {
    console.log('No seed files found.');
  }
}

// Database interface
const db = {
  migrate,
  seed,
  sqlite,
  users: {
    findByUsername: (username) => {
      const stmt = sqlite.prepare('SELECT * FROM users WHERE username = ?');
      return stmt.get(username);
    },
    findById: (id) => {
      const stmt = sqlite.prepare('SELECT * FROM users WHERE id = ?');
      return stmt.get(id);
    },
    create: (username, password) => {
      const stmt = sqlite.prepare(
        'INSERT INTO users (username, password, created_at) VALUES (?, ?, ?) RETURNING *'
      );
      return stmt.get(username, password, new Date().toISOString());
    }
  },
  servers: {
    findByUserId: (userId) => {
      const stmt = sqlite.prepare('SELECT * FROM servers WHERE user_id = ?');
      return stmt.all(userId);
    },
    findById: (id) => {
      const stmt = sqlite.prepare('SELECT * FROM servers WHERE id = ?');
      return stmt.get(id);
    },
    create: (serverData) => {
      const stmt = sqlite.prepare(
        `INSERT INTO servers (
          name, ip_address, latitude, longitude, user_id,
          memory, cpu_cores, hard_drive_size
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
      );
      return stmt.get(
        serverData.name,
        serverData.ip_address,
        serverData.latitude,
        serverData.longitude,
        serverData.user_id,
        serverData.memory || null,
        serverData.cpu_cores || null,
        serverData.hard_drive_size || null
      );
    },
    update: (id, serverData) => {
      const stmt = sqlite.prepare(
        `UPDATE servers SET 
          name = ?, 
          ip_address = ?, 
          latitude = ?, 
          longitude = ?,
          memory = ?,
          cpu_cores = ?,
          hard_drive_size = ?
        WHERE id = ? RETURNING *`
      );
      return stmt.get(
        serverData.name,
        serverData.ip_address,
        serverData.latitude,
        serverData.longitude,
        serverData.memory || null,
        serverData.cpu_cores || null,
        serverData.hard_drive_size || null,
        id
      );
    },
    delete: (id) => {
      const stmt = sqlite.prepare('DELETE FROM servers WHERE id = ?');
      return stmt.run(id);
    }
  },
  ec2_instances: {
    findByUserId: (userId) => {
      const stmt = sqlite.prepare('SELECT * FROM ec2_instances WHERE user_id = ?');
      return stmt.all(userId);
    },
    getAll: () => {
      const stmt = sqlite.prepare('SELECT * FROM ec2_instances');
      return stmt.all();
    },
    findById: (id) => {
      const stmt = sqlite.prepare('SELECT * FROM ec2_instances WHERE id = ?');
      return stmt.get(id);
    },
    create: (instanceData) => {
      const stmt = sqlite.prepare(
        `INSERT INTO ec2_instances (
          name, instance_id, instance_state, launch_time, 
          private_ip_address, image_id, host_id, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
      );
      return stmt.get(
        instanceData.name,
        instanceData.instance_id,
        instanceData.instance_state,
        instanceData.launch_time,
        instanceData.private_ip_address,
        instanceData.image_id,
        instanceData.host_id,
        instanceData.user_id
      );
    }
  },
  spots: {
    findByUserId: (userId) => {
      const stmt = sqlite.prepare(`
        SELECT s.*, srv.name as server_name, srv.ip_address 
        FROM spots s
        JOIN servers srv ON s.server_id = srv.id
        WHERE s.user_id = ?
      `);
      return stmt.all(userId);
    },
    findByServerId: (serverId) => {
      const stmt = sqlite.prepare('SELECT * FROM spots WHERE server_id = ?');
      return stmt.all(serverId);
    },
    findByGuid: (guid) => {
      const stmt = sqlite.prepare(`
        SELECT s.*, srv.name as server_name, srv.ip_address 
        FROM spots s
        JOIN servers srv ON s.server_id = srv.id
        WHERE s.guid = ?
      `);
      return stmt.get(guid);
    },
    findById: (id) => {
      const stmt = sqlite.prepare(`
        SELECT s.*, srv.name as server_name, srv.ip_address 
        FROM spots s
        JOIN servers srv ON s.server_id = srv.id
        WHERE s.id = ?
      `);
      return stmt.get(id);
    },
    create: (spotData) => {
      const stmt = sqlite.prepare(
        `INSERT INTO spots (
          server_id, user_id, memory, cpu_cores, hard_drive_size, guid
        ) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
      );
      return stmt.get(
        spotData.server_id,
        spotData.user_id,
        spotData.memory || null,
        spotData.cpu_cores || null,
        spotData.hard_drive_size || null,
        spotData.guid || randomUUID()
      );
    },
    update: (id, spotData) => {
      const stmt = sqlite.prepare(
        `UPDATE spots SET 
          memory = ?,
          cpu_cores = ?,
          hard_drive_size = ?,
          guid = ?
        WHERE id = ? RETURNING *`
      );
      return stmt.get(
        spotData.memory || null,
        spotData.cpu_cores || null,
        spotData.hard_drive_size || null,
        spotData.guid || null,
        id
      );
    },
    delete: (id) => {
      const stmt = sqlite.prepare('DELETE FROM spots WHERE id = ?');
      return stmt.run(id);
    }
  }
};

module.exports = {
  db,
  initialize: () => {
    migrate();
    seed();
  }
};
