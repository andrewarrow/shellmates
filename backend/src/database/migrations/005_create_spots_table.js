/**
 * Migration to create the spots table
 */
module.exports = {
  up: (db) => {
    // Create spots table with foreign keys to servers and users
    db.prepare(`
      CREATE TABLE IF NOT EXISTS spots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        memory TEXT,
        cpu_cores INTEGER,
        hard_drive_size TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (server_id) REFERENCES servers (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `).run();

    // Create indexes for faster lookups
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_spots_server_id ON spots (server_id)
    `).run();
    
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_spots_user_id ON spots (user_id)
    `).run();
  },
  down: (db) => {
    // Drop spots table
    db.prepare('DROP TABLE IF EXISTS spots').run();
  }
};