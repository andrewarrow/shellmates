/**
 * Seed file for spots table
 */
module.exports = {
  run: (db) => {
    // Insert seed data for spots
    const insertSpot = db.prepare(`
      INSERT INTO spots (
        server_id, user_id, memory, cpu_cores, hard_drive_size, guid
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    // First spot with specific GUID
    insertSpot.run(
      1, // server_id
      1, // user_id
      '4GB', // memory
      2, // cpu_cores
      '100GB', // hard_drive_size
      'c8f3c470-f353-4804-bd5c-a5c30bba7dbb' // specific guid
    );

    // Add a few more spots with null GUIDs (will be handled by the db.js functions)
    insertSpot.run(2, 1, '8GB', 4, '250GB', null);
    insertSpot.run(1, 2, '2GB', 1, '50GB', null);
  }
};