/**
 * Seed file to update user profile information
 */
module.exports = {
  run: (db) => {
    // Begin transaction
    const transaction = db.transaction(() => {
      console.log('Running seed 005_update_user_profiles.js');
      
      // Get all users
      const users = db.prepare('SELECT id, username FROM users').all();
      
      if (users && users.length > 0) {
        console.log(`Found ${users.length} users to update`);
        
        // Update each user
        users.forEach(user => {
          console.log(`Updating profile for user ${user.username} (ID: ${user.id})`);
          
          // Force update all users
          db.prepare(`
            UPDATE users 
            SET first_name = ?, last_name = ?, email = ?
            WHERE id = ?
          `).run('Andrew', 'Arrow', 'andrew@example.com', user.id);
          
          console.log(`Updated profile for user ${user.username}`);
          
          // Verify update
          const updated = db.prepare('SELECT first_name, last_name, email FROM users WHERE id = ?').get(user.id);
          console.log('Updated user data:', JSON.stringify(updated));
        });
      } else {
        console.log('No users found to update');
      }
    });
    
    // Execute the transaction
    transaction();
    
    // Verify after transaction
    const allUsers = db.prepare('SELECT id, username, first_name, last_name, email FROM users').all();
    console.log('All users after update:', JSON.stringify(allUsers));
  }
};