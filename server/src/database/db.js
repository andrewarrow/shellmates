const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// In-memory database for simplicity
const users = [];

// Initialize database with required data
function initialize() {
  console.log('Initializing in-memory database...');
  
  // Add test user if needed
  const testUser = users.find(user => user.username === 'andrewarrow');
  if (!testUser) {
    const hashedPassword = bcrypt.hashSync('testing', 10);
    users.push({
      id: 1,
      username: 'andrewarrow',
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
    console.log('Test user "andrewarrow" created');
  }
}

// User operations
const db = {
  users: {
    findByUsername: (username) => {
      return users.find(user => user.username === username);
    },
    findById: (id) => {
      return users.find(user => user.id === id);
    },
    create: (username, password) => {
      const newUser = {
        id: users.length + 1,
        username,
        password,
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      return newUser;
    }
  }
};

module.exports = {
  db,
  initialize,
};
