/**
 * Migration to create the ec2_instances table
 */
module.exports = {
  up: (db) => {
    // Create ec2_instances table with a foreign key to users
    db.prepare(`
      CREATE TABLE IF NOT EXISTS ec2_instances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        instance_id TEXT NOT NULL,
        instance_state TEXT NOT NULL,
        launch_time TEXT NOT NULL,
        private_ip_address TEXT,
        image_id TEXT NOT NULL,
        host_id TEXT,
        user_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `).run();

    // Create index for faster lookups by user_id
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_ec2_instances_user_id ON ec2_instances (user_id)
    `).run();
  },
  down: (db) => {
    // Drop ec2_instances table
    db.prepare('DROP TABLE IF EXISTS ec2_instances').run();
  }
};