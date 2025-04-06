/**
 * Seed file for the servers table
 */
module.exports = {
  run: (db) => {
    // Check if we have any users to associate servers with
    const users = db.prepare('SELECT id FROM users').all();
    if (users.length === 0) {
      console.log('No users found, skipping server seeding');
      return;
    }

    // Get the first user to associate servers with
    const userId = users[0].id;

    // Create initial server
    const servers = [
      {
        name: 'Main Server',
        ip_address: '44.44.12.34',
        latitude: 37.7749,
        longitude: -122.4194,
        memory: '8GB',
        cpu_cores: 4,
        hard_drive_size: '256GB',
        user_id: userId
      }
    ];

    // Insert servers
    const insertStmt = db.prepare(`
      INSERT INTO servers (name, ip_address, latitude, longitude, memory, cpu_cores, hard_drive_size, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Use a transaction for bulk insert
    const insertMany = db.transaction((servers) => {
      for (const server of servers) {
        insertStmt.run(
          server.name,
          server.ip_address,
          server.latitude,
          server.longitude,
          server.memory,
          server.cpu_cores,
          server.hard_drive_size,
          server.user_id
        );
      }
    });

    // Execute the transaction
    insertMany(servers);
    console.log(`Inserted ${servers.length} servers`);
  }
};