/**
 * Seed file for users and EC2 instances
 */
const bcrypt = require('bcrypt');

module.exports = {
  run: (db) => {
    // Begin transaction
    const transaction = db.transaction(() => {
      // Check if test user already exists
      const userExists = db.prepare('SELECT id FROM users WHERE username = ?').get('andrewarrow');
      
      let userId = null;
      
      if (!userExists) {
        // Create test user
        const hashedPassword = bcrypt.hashSync('testing', 10);
        userId = db.prepare(
          'INSERT INTO users (username, password, created_at) VALUES (?, ?, ?) RETURNING id'
        ).get('andrewarrow', hashedPassword, new Date().toISOString()).id;
        
        console.log('Seed: Created user andrewarrow with ID:', userId);
      } else {
        userId = userExists.id;
        console.log('Seed: User andrewarrow already exists with ID:', userId);
      }

      // Only add EC2 instances if none exist yet
      const instanceCount = db.prepare('SELECT COUNT(*) as count FROM ec2_instances').get().count;
      
      if (instanceCount === 0 && userId) {
        // Create 3 sample EC2 instances
        const instances = [
          {
            name: 'Web Server',
            instance_id: 'i-0abc123def456789',
            instance_state: 'running',
            launch_time: '2023-01-15T08:30:00Z',
            private_ip_address: '10.0.1.100',
            image_id: 'ami-0c55b159cbfafe1f0',
            host_id: 'h-0abcdef123456789',
            user_id: userId
          },
          {
            name: 'Database Server',
            instance_id: 'i-0def456abc789012',
            instance_state: 'running',
            launch_time: '2023-01-15T08:35:00Z',
            private_ip_address: '10.0.1.101',
            image_id: 'ami-0be2609ba883822ec',
            host_id: 'h-1bcdef234567890a',
            user_id: userId
          },
          {
            name: 'Worker Node',
            instance_id: 'i-0ghi789jkl012345',
            instance_state: 'stopped',
            launch_time: '2023-02-10T14:20:00Z', 
            private_ip_address: '10.0.1.102',
            image_id: 'ami-0a313d6098716f372',
            host_id: 'h-2cdefg345678901b',
            user_id: userId
          }
        ];

        // Insert the instances
        const insertStmt = db.prepare(`
          INSERT INTO ec2_instances (
            name, instance_id, instance_state, launch_time, 
            private_ip_address, image_id, host_id, user_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        instances.forEach(instance => {
          insertStmt.run(
            instance.name,
            instance.instance_id,
            instance.instance_state,
            instance.launch_time,
            instance.private_ip_address,
            instance.image_id,
            instance.host_id,
            instance.user_id
          );
        });

        console.log('Seed: Created 3 sample EC2 instances');
      } else if (instanceCount > 0) {
        console.log('Seed: EC2 instances already exist, skipping');
      }
    });
    
    // Execute the transaction
    transaction();
  }
};