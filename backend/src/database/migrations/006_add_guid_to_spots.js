/**
 * Migration to add guid column to spots table
 */
module.exports = {
  up: (db) => {
    // Add guid column to spots table
    db.prepare(`
      ALTER TABLE spots ADD COLUMN guid TEXT
    `).run();
    
    // Create index for faster lookups
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_spots_guid ON spots (guid)
    `).run();
  },
  down: (db) => {
    // We can't drop columns in SQLite easily, but we can remove the index
    db.prepare('DROP INDEX IF EXISTS idx_spots_guid').run();
  }
};