/**
 * Migration to add buy_url field to stripes table
 */
module.exports = {
  up: (db) => {
    // Add buy_url column to stripes table
    db.prepare(`
      ALTER TABLE stripes
      ADD COLUMN buy_url TEXT
    `).run();
  },
  down: (db) => {
    // SQLite doesn't support dropping columns directly
    // We'd need to create a new table, copy data, drop old table, rename new table
    // This is a simplification that just notes what would need to be undone
    console.log('SQLite does not support dropping columns. Manual intervention required to remove buy_url column.');
  }
};