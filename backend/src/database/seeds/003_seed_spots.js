/**
 * Seed file for spots table
 */
module.exports = {
  run: (db) => {
    // First, check if we have servers and users available
    const servers = db.prepare('SELECT id FROM servers').all();
    const users = db.prepare('SELECT id FROM users').all();
    
    if (servers.length === 0) {
      console.log('No servers found, skipping spots seeding');
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found, skipping spots seeding');
      return;
    }
    
    const firstServerId = servers[0].id;
    const firstUserId = users[0].id;
    
    // Check if the spot with this GUID already exists
    const existingSpot = db.prepare('SELECT id FROM spots WHERE guid = ?').get('c8f3c470-f353-4804-bd5c-a5c30bba7dbb');
    
    if (existingSpot) {
      console.log('Spot with specific GUID already exists, skipping');
    } else {
      // Insert seed data for spots
      const insertSpot = db.prepare(`
        INSERT INTO spots (
          server_id, user_id, memory, cpu_cores, hard_drive_size, guid
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      // First spot with specific GUID
      insertSpot.run(
        firstServerId,
        firstUserId,
        '4GB', // memory
        2, // cpu_cores
        '100GB', // hard_drive_size
        'c8f3c470-f353-4804-bd5c-a5c30bba7dbb' // specific guid
      );
      
      console.log('Created spot with GUID: c8f3c470-f353-4804-bd5c-a5c30bba7dbb');
      
      // Only add more spots if we have few existing ones
      const spotCount = db.prepare('SELECT COUNT(*) as count FROM spots').get().count;
      
      if (spotCount < 2) {
        if (servers.length > 1) {
          // Add a spot for the second server
          insertSpot.run(servers[1].id, firstUserId, '8GB', 4, '250GB', null);
        } else {
          // Use the first server if only one exists
          insertSpot.run(firstServerId, firstUserId, '8GB', 4, '250GB', null);
        }
        
        // Add a spot for another user if available
        if (users.length > 1) {
          insertSpot.run(firstServerId, users[1].id, '2GB', 1, '50GB', null);
        }
        
        console.log('Added additional spots');
      }
    }
  }
};