const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const ec2Routes = require('./routes/ec2');
const serverRoutes = require('./routes/servers');
const spotRoutes = require('./routes/spots');
const stripeRoutes = require('./routes/stripes');
const adminRoutes = require('./routes/admin');

// Database initialization
const db = require('./database/db');
db.initialize();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ 
  credentials: true, 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

// Special handling for Stripe webhook route - must come before express.json() middleware
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Standard middlewares for other routes
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ec2', ec2Routes);
app.use('/api/servers', serverRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);

// Always serve the static HTML files for terms and privacy in both dev and prod
const termsPrivacyPath = path.join(__dirname, '../../frontend/public');
app.use('/terms', express.static(path.join(termsPrivacyPath, 'terms')));
app.use('/privacy', express.static(path.join(termsPrivacyPath, 'privacy')));


// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  // In production, the frontend is in frontend/ at the same level as backend/
  const frontendPath = path.join(__dirname, '../../frontend');
  console.log('Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));
  
  // Terms and Privacy pages are now handled globally above
  
  // Catch-all route for the React app
  app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    console.log('Serving index from:', indexPath);
    res.sendFile(indexPath);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
