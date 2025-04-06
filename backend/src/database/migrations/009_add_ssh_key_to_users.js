/**
 * Migration to add ssh_key field to users table
 */
exports.up = function(db) {
  db.exec(`
    ALTER TABLE users 
    ADD COLUMN ssh_key TEXT;
  `);
};

exports.down = function(db) {
  // SQLite doesn't support dropping columns without recreating the table
  // For a real down migration, we would need to:
  // 1. Create a new table without these columns
  // 2. Copy data from old table to new table
  // 3. Drop old table
  // 4. Rename new table to old table name
  // But for simplicity, we'll just note that this can't be easily reversed
  console.log('SQLite does not support dropping columns directly');
};