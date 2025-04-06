const express = require('express');
const router = express.Router();
const { db } = require('../database/db');
const auth = require('../middleware/auth');

// Get current user's stripe settings
router.get('/', auth, (req, res) => {
  try {
    // Query to find stripe settings for the current user
    const stmt = db.sqlite.prepare(`
      SELECT * FROM stripes WHERE user_id = ?
    `);
    const stripeSettings = stmt.get(req.userId);
    
    if (!stripeSettings) {
      return res.json({ message: 'No Stripe settings found' });
    }
    
    res.json(stripeSettings);
  } catch (error) {
    console.error('Error fetching stripe settings:', error);
    res.status(500).json({ message: 'Failed to fetch stripe settings' });
  }
});

// Create or update stripe settings
router.post('/', auth, (req, res) => {
  const { sk_key, pk_key, buy_url } = req.body;
  
  if (!sk_key || !pk_key) {
    return res.status(400).json({ message: 'Both secret key and publishable key are required' });
  }
  
  try {
    // Check if user already has stripe settings
    const existingSettings = db.sqlite.prepare('SELECT * FROM stripes WHERE user_id = ?').get(req.userId);
    
    if (existingSettings) {
      // Update existing settings
      const stmt = db.sqlite.prepare(`
        UPDATE stripes 
        SET sk_key = ?, pk_key = ?, buy_url = ? 
        WHERE user_id = ? 
        RETURNING *
      `);
      const updatedSettings = stmt.get(sk_key, pk_key, buy_url || null, req.userId);
      res.json(updatedSettings);
    } else {
      // Create new settings
      const stmt = db.sqlite.prepare(`
        INSERT INTO stripes (user_id, sk_key, pk_key, buy_url)
        VALUES (?, ?, ?, ?)
        RETURNING *
      `);
      const newSettings = stmt.get(req.userId, sk_key, pk_key, buy_url || null);
      res.status(201).json(newSettings);
    }
  } catch (error) {
    console.error('Error saving stripe settings:', error);
    res.status(500).json({ message: 'Failed to save stripe settings' });
  }
});

// Delete stripe settings
router.delete('/', auth, (req, res) => {
  try {
    const stmt = db.sqlite.prepare('DELETE FROM stripes WHERE user_id = ?');
    const result = stmt.run(req.userId);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'No Stripe settings found' });
    }
    
    res.json({ message: 'Stripe settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting stripe settings:', error);
    res.status(500).json({ message: 'Failed to delete stripe settings' });
  }
});

module.exports = router;