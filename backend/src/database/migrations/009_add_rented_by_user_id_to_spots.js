/**
 * Migration to add rented_by_user_id field to spots table
 */
module.exports = {
  up: (db) => {
    // Add rented_by_user_id column to spots table with foreign key to users
    db.prepare(`
      ALTER TABLE spots 
      ADD COLUMN rented_by_user_id INTEGER DEFAULT NULL
      REFERENCES users(id) ON DELETE SET NULL
    `).run();
    
    // Create index for faster lookups
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_spots_rented_by_user_id ON spots (rented_by_user_id)
    `).run();
  },
  down: (db) => {
    // SQLite does not support DROP COLUMN directly, so we'd need to recreate the table
    // This is a simplified version - in production, data would need to be preserved
    db.prepare(`
      CREATE TABLE spots_backup AS
      SELECT 
        id, server_id, user_id, memory, cpu_cores, hard_drive_size, created_at, guid
      FROM spots
    `).run();
    
    db.prepare('DROP TABLE spots').run();
    
    db.prepare(`
      CREATE TABLE spots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        memory TEXT,
        cpu_cores INTEGER,
        hard_drive_size TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        guid TEXT,
        FOREIGN KEY (server_id) REFERENCES servers (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `).run();
    
    db.prepare(`
      INSERT INTO spots (id, server_id, user_id, memory, cpu_cores, hard_drive_size, created_at, guid)
      SELECT id, server_id, user_id, memory, cpu_cores, hard_drive_size, created_at, guid
      FROM spots_backup
    `).run();
    
    db.prepare('DROP TABLE spots_backup').run();
    
    // Recreate original indexes
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_spots_server_id ON spots (server_id)`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_spots_user_id ON spots (user_id)`).run();
  }
};