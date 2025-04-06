/**
 * Seed file to assign rented_by_user_id to some spots
 */
module.exports = {
  run: (db) => {
    // First, check if we have spots and users available
    const spots = db.prepare('SELECT id, guid FROM spots').all();
    const users = db.prepare('SELECT id FROM users').all();
    
    if (spots.length === 0) {
      console.log('No spots found, skipping rented spots seeding');
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found, skipping rented spots seeding');
      return;
    }
    
    // Get the first user to assign as the renter
    const renterUserId = users[0].id;
    
    // Prepare the update statement
    const updateSpot = db.prepare(`
      UPDATE spots 
      SET rented_by_user_id = ? 
      WHERE guid = ?
    `);
    
    // Update the spot with the specific GUID to be rented by the first user
    const specificSpotGuid = 'c8f3c470-f353-4804-bd5c-a5c30bba7dbb';
    const result = updateSpot.run(renterUserId, specificSpotGuid);
    
    if (result.changes > 0) {
      console.log(`Assigned spot with GUID ${specificSpotGuid} to user ID ${renterUserId}`);
    } else {
      console.log(`Spot with GUID ${specificSpotGuid} not found or already assigned`);
    }
    
    // If we have more than one spot, assign the second spot to the same user
    if (spots.length > 1) {
      // Use a different spot than the one with the specific GUID
      const otherSpot = spots.find(spot => spot.guid !== specificSpotGuid);
      if (otherSpot) {
        updateSpot.run(renterUserId, otherSpot.guid);
        console.log(`Assigned spot with ID ${otherSpot.id} to user ID ${renterUserId}`);
      }
    }
  }
};