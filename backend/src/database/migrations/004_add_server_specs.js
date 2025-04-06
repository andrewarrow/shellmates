/**
 * Migration to add hardware specification columns to the servers table
 */
module.exports = {
  up: (db) => {
    // Add columns for hardware specifications
    db.prepare(`
      ALTER TABLE servers 
      ADD COLUMN memory TEXT;
    `).run();
    
    db.prepare(`
      ALTER TABLE servers 
      ADD COLUMN cpu_cores INTEGER;
    `).run();
    
    db.prepare(`
      ALTER TABLE servers 
      ADD COLUMN hard_drive_size TEXT;
    `).run();
  },
  down: (db) => {
    // SQLite doesn't support dropping columns directly
    // Would need to create a new table without these columns and migrate data
    console.log('Down migration not implemented for adding server specs');
  }
};