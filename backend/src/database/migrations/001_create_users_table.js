/**
 * Migration to create the users table
 */
module.exports = {
  up: (db) => {
    // Create users table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `).run();
  },
  down: (db) => {
    // Drop users table
    db.prepare('DROP TABLE IF EXISTS users').run();
  }
};