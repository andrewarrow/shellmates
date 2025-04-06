/**
 * Migration to create the stripes table for storing user Stripe API keys
 */
module.exports = {
  up: (db) => {
    // Create stripes table with foreign key to users
    db.prepare(`
      CREATE TABLE IF NOT EXISTS stripes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        sk_key TEXT,
        pk_key TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `).run();

    // Create unique index to ensure one stripe entry per user
    db.prepare(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_stripes_user_id ON stripes (user_id)
    `).run();
  },
  down: (db) => {
    // Drop stripes table
    db.prepare('DROP TABLE IF EXISTS stripes').run();
  }
};