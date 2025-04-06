const express = require('express');
const router = express.Router();

const { db } = require('../database/db');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

// List all users - admin only
router.get('/users', auth, adminOnly, (req, res) => {
  try {
    // Query to get all users
    const stmt = db.sqlite.prepare('SELECT * FROM users');
    const users = stmt.all();
    
    // Remove sensitive information before sending
    const safeUsers = users.map(user => ({
      ...user,
      password: undefined
    }));
    
    res.json({ users: safeUsers });
  } catch (error) {
    console.error('Admin users retrieval error:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

module.exports = router;