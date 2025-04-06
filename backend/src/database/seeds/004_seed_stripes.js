/**
 * Seed file to create sample Stripe settings for users
 */
module.exports = {
  run: (db) => {
    console.log('Seeding stripes data...');
    
    // Get the first user
    const user = db.prepare('SELECT id FROM users LIMIT 1').get();
    
    if (!user) {
      console.log('No users found, skipping stripes seeding');
      return;
    }
    
    // Check if stripes data already exists for this user
    const existingStripes = db.prepare('SELECT COUNT(*) as count FROM stripes WHERE user_id = ?').get(user.id);
    
    if (existingStripes.count > 0) {
      console.log('Stripes data already exists for user ID ' + user.id + ', skipping seed');
      return;
    }
    
    // Insert sample stripe data for the user
    const insertStmt = db.prepare(`
      INSERT INTO stripes (user_id, sk_key, pk_key, buy_url, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertStmt.run(
      user.id, // User ID
      'sk_test_example123', // Secret Key (fake)
      'pk_test_example123', // Public Key (fake)
      'https://buy.stripe.com/test_example', // Buy URL
      new Date().toISOString()
    );
    
    console.log('Stripes data seeded successfully for user ID: ' + user.id);
  }
};