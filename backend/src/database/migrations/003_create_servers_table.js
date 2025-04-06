/**
 * Migration to create the servers table
 */
module.exports = {
  up: (db) => {
    // Create servers table with a foreign key to users
    db.prepare(`
      CREATE TABLE IF NOT EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        user_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `).run();

    // Create index for faster lookups by user_id
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_servers_user_id ON servers (user_id)
    `).run();
  },
  down: (db) => {
    // Drop servers table
    db.prepare('DROP TABLE IF EXISTS servers').run();
  }
};