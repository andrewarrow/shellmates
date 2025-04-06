const express = require('express');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all EC2 instances for the logged-in user
router.get('/', authMiddleware, (req, res) => {
  try {
    const instances = db.ec2_instances.findByUserId(req.userId);
    res.json(instances);
  } catch (error) {
    console.error('Error fetching EC2 instances:', error);
    res.status(500).json({ message: 'Failed to fetch EC2 instances' });
  }
});

// Get EC2 instance by ID
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const instance = db.ec2_instances.findById(req.params.id);
    
    if (!instance || instance.user_id !== req.userId) {
      return res.status(404).json({ message: 'EC2 instance not found' });
    }
    
    res.json(instance);
  } catch (error) {
    console.error('Error fetching EC2 instance:', error);
    res.status(500).json({ message: 'Failed to fetch EC2 instance' });
  }
});

module.exports = router;