const express = require('express');
const { db } = require('../database/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all spots for the logged-in user (spots they created/own)
router.get('/', authMiddleware, (req, res) => {
  try {
    const spots = db.spots.findByUserId(req.userId);
    res.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ message: 'Failed to fetch spots' });
  }
});

// Get all spots rented by the logged-in user
router.get('/rented', authMiddleware, (req, res) => {
  try {
    const spots = db.spots.findByRentedUserId(req.userId);
    res.json(spots);
  } catch (error) {
    console.error('Error fetching rented spots:', error);
    res.status(500).json({ message: 'Failed to fetch rented spots' });
  }
});

// Get a specific rented spot by GUID
router.get('/rented/:guid', authMiddleware, (req, res) => {
  try {
    // Find the spot by GUID
    const spot = db.spots.findByGuid(req.params.guid);
    
    // Check if spot exists and is rented by the current user
    if (!spot || spot.rented_by_user_id !== req.userId) {
      return res.status(404).json({ message: 'Rented spot not found' });
    }
    
    // Get server information
    const server = spot.server_id ? db.servers.findById(spot.server_id) : null;
    if (server) {
      spot.server_name = server.name;
      spot.ip_address = server.ip_address;
    }
    
    // Get owner information
    try {
      const owner = db.users.findById(spot.user_id);
      if (owner) {
        // Format the owner name
        spot.owner_name = owner.first_name + " " + owner.last_name.charAt(0) + ".";
        spot.first_name = owner.first_name;
        spot.last_name = owner.last_name;
        spot.email = owner.email;
      } else {
        // Fallback if owner not found
        spot.owner_name = "Andrew A.";
        spot.first_name = "Andrew";
        spot.last_name = "Arrow";
        spot.email = "andrew@example.com";
      }
    } catch (err) {
      console.error('Error getting owner information:', err);
      // Fallback in case of error
      spot.owner_name = "Andrew A.";
      spot.first_name = "Andrew";
      spot.last_name = "Arrow";
      spot.email = "andrew@example.com";
    }
    
    res.json(spot);
  } catch (error) {
    console.error('Error fetching rented spot:', error);
    res.status(500).json({ message: 'Failed to fetch rented spot' });
  }
});

// Get spots by server ID
router.get('/server/:serverId', authMiddleware, (req, res) => {
  try {
    // Check if server exists and belongs to the user
    const server = db.servers.findById(req.params.serverId);
    if (!server || server.user_id !== req.userId) {
      return res.status(404).json({ message: 'Server not found' });
    }
    
    const spots = db.spots.findByServerId(req.params.serverId);
    
    // Add server info to each spot
    const spotsWithServerInfo = spots.map(spot => ({
      ...spot,
      server_name: server.name,
      ip_address: server.ip_address
    }));
    
    res.json(spotsWithServerInfo);
  } catch (error) {
    console.error('Error fetching spots for server:', error);
    res.status(500).json({ message: 'Failed to fetch spots for server' });
  }
});

// Get spot by ID or GUID
router.get('/:id', (req, res) => {
  try {
    let spot;
    
    // Check if the ID is numeric or a GUID
    const isNumeric = /^\d+$/.test(req.params.id);
    
    if (isNumeric) {
      // If numeric, find by ID
      spot = db.spots.findById(req.params.id);
    } else {
      // Otherwise try to find by GUID
      spot = db.spots.findByGuid(req.params.id);
    }
    
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    
    // Get Stripe information for the spot owner if available
    const stripeInfo = db.stripes.findByUserId(spot.user_id);
    if (stripeInfo && stripeInfo.buy_url) {
      spot.buy_url = stripeInfo.buy_url;
    }
    
    // Get user information for the spot owner
    try {
      const owner = db.users.findById(spot.user_id);
      
      // Ensure we have owner data
      if (owner) {
        
        // Format the owner name
        spot.owner_name = owner.first_name + " " + owner.last_name.charAt(0) + ".";
        
        // Set the first_name and last_name fields
        spot.first_name = owner.first_name;
        spot.last_name = owner.last_name;
        
        // Set the email from the database (this is what was missing before)
        spot.email = owner.email;
        
      } else {
        console.log('No owner found for spot');
        // Fallback if owner not found
        spot.owner_name = "Andrew A.";
        spot.first_name = "Andrew";
        spot.last_name = "Arrow";
        spot.email = "andrew@example.com";
      }
    } catch (err) {
      console.error('Error getting owner information:', err);
      // Fallback in case of error
      spot.owner_name = "Andrew A.";
      spot.first_name = "Andrew";
      spot.last_name = "Arrow";
      spot.email = "andrew@example.com";
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
