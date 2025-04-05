const express = require('express');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all spots for the logged-in user
router.get('/', authMiddleware, (req, res) => {
  try {
    const spots = db.spots.findByUserId(req.userId);
    res.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ message: 'Failed to fetch spots' });
  }
});

// Get spot by ID
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const spot = db.spots.findById(req.params.id);
    
    if (!spot || spot.user_id !== req.userId) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    
    res.json(spot);
  } catch (error) {
    console.error('Error fetching spot:', error);
    res.status(500).json({ message: 'Failed to fetch spot' });
  }
});

// Create a new spot
router.post('/', authMiddleware, (req, res) => {
  try {
    const { server_id, memory, cpu_cores, hard_drive_size } = req.body;
    
    // Validate input
    if (!server_id) {
      return res.status(400).json({ message: 'Server ID is required' });
    }
    
    // Check if server exists and belongs to the user
    const server = db.servers.findById(server_id);
    if (!server || server.user_id !== req.userId) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    // Create spot
    const spot = db.spots.create({
      server_id,
      user_id: req.userId,
      memory: memory || null,
      cpu_cores: cpu_cores || null,
      hard_drive_size: hard_drive_size || null
    });
    
    // Add server data to response
    const spotWithServer = {
      ...spot,
      server_name: server.name,
      ip_address: server.ip_address
    };
    
    res.status(201).json(spotWithServer);
  } catch (error) {
    console.error('Error creating spot:', error);
    res.status(500).json({ message: 'Failed to create spot' });
  }
});

// Update an existing spot
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { memory, cpu_cores, hard_drive_size } = req.body;
    
    // Check if spot exists and belongs to the user
    const existingSpot = db.spots.findById(req.params.id);
    if (!existingSpot || existingSpot.user_id !== req.userId) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    
    // Update spot
    const updatedSpot = db.spots.update(req.params.id, {
      memory: memory || null,
      cpu_cores: cpu_cores || null,
      hard_drive_size: hard_drive_size || null
    });
    
    res.json(updatedSpot);
  } catch (error) {
    console.error('Error updating spot:', error);
    res.status(500).json({ message: 'Failed to update spot' });
  }
});

// Delete a spot
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    // Check if spot exists and belongs to the user
    const spot = db.spots.findById(req.params.id);
    if (!spot || spot.user_id !== req.userId) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    
    // Delete spot
    db.spots.delete(req.params.id);
    
    res.json({ message: 'Spot deleted successfully' });
  } catch (error) {
    console.error('Error deleting spot:', error);
    res.status(500).json({ message: 'Failed to delete spot' });
  }
});

module.exports = router;