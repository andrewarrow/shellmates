const express = require('express');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all servers for the logged-in user
router.get('/', authMiddleware, (req, res) => {
  try {
    const servers = db.servers.findByUserId(req.userId);
    res.json(servers);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Failed to fetch servers' });
  }
});

// Get server by ID
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const server = db.servers.findById(req.params.id);
    
    if (!server || server.user_id !== req.userId) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    res.json(server);
  } catch (error) {
    console.error('Error fetching server:', error);
    res.status(500).json({ message: 'Failed to fetch server' });
  }
});

// Create a new server
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, ip_address, latitude, longitude, memory, cpu_cores, hard_drive_size } = req.body;
    
    // Validate input
    if (!name || !ip_address) {
      return res.status(400).json({ message: 'Name and IP address are required' });
    }
    
    // Create server
    const server = db.servers.create({
      name,
      ip_address,
      latitude: latitude || null,
      longitude: longitude || null,
      memory: memory || null,
      cpu_cores: cpu_cores || null,
      hard_drive_size: hard_drive_size || null,
      user_id: req.userId
    });
    
    res.status(201).json(server);
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(500).json({ message: 'Failed to create server' });
  }
});

// Update an existing server
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { name, ip_address, latitude, longitude, memory, cpu_cores, hard_drive_size } = req.body;
    
    // Validate input
    if (!name || !ip_address) {
      return res.status(400).json({ message: 'Name and IP address are required' });
    }
    
    // Check if server exists and belongs to the user
    const existingServer = db.servers.findById(req.params.id);
    if (!existingServer || existingServer.user_id !== req.userId) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    // Update server
    const updatedServer = db.servers.update(req.params.id, {
      name,
      ip_address,
      latitude: latitude || null,
      longitude: longitude || null,
      memory: memory || null,
      cpu_cores: cpu_cores || null,
      hard_drive_size: hard_drive_size || null
    });
    
    res.json(updatedServer);
  } catch (error) {
    console.error('Error updating server:', error);
    res.status(500).json({ message: 'Failed to update server' });
  }
});

// Delete a server
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    // Check if server exists and belongs to the user
    const server = db.servers.findById(req.params.id);
    if (!server || server.user_id !== req.userId) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    // Delete server
    db.servers.delete(req.params.id);
    
    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Error deleting server:', error);
    res.status(500).json({ message: 'Failed to delete server' });
  }
});

module.exports = router;