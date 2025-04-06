const express = require('express');
const router = express.Router();
const { db } = require('../database/db');
const auth = require('../middleware/auth');
const Stripe = require('stripe');

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
      const updatedSettings = db.stripes.update(req.userId, sk_key, pk_key, buy_url);
      res.json(updatedSettings);
    } else {
      // Create new settings
      const newSettings = db.stripes.create(req.userId, sk_key, pk_key, buy_url);
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

// Initiate payment process - store spot guid in cookie and create checkout session
router.post('/initiate-payment', async (req, res) => {
  const { spotGuid } = req.body;
  
  if (!spotGuid) {
    return res.status(400).json({ message: 'Spot GUID is required' });
  }
  
  try {
    // Find the spot
    const spot = db.spots.findByGuid(spotGuid);
    
    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }
    
    // Set cookie with spot guid (for callback route)
    res.cookie('spot_guid', spotGuid, { 
      httpOnly: true, 
      maxAge: 3600000, // 1 hour
      sameSite: 'lax',
      path: '/'
    });
    
    // Find stripe settings for spot owner
    const stripeSettings = db.stripes.findByUserId(spot.user_id);
    
    if (!stripeSettings || !stripeSettings.sk_key) {
      return res.status(400).json({ message: 'Payment configuration not available for this spot' });
    }
    
    // Initialize Stripe with the seller's secret key
    const stripe = Stripe(stripeSettings.sk_key);
    
    // If buy_url exists, use it directly
    if (stripeSettings.buy_url) {
      return res.json({ buyUrl: stripeSettings.buy_url });
    }
    
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ message: 'Failed to initiate payment process' });
  }
});

// Callback endpoint for Stripe after payment completion
router.get('/callback', async (req, res) => {
  const { session_id } = req.query;
  const spotGuid = req.cookies?.spot_guid;
  
  if (!spotGuid) {
    return res.redirect('/dashboard?error=missing_spot_reference');
  }
  
  try {
    // Find the spot
    const spot = db.spots.findByGuid(spotGuid);
    
    if (!spot) {
      return res.redirect('/spot/' + spotGuid + '?error=invalid_spot');
    }
    
    // Find stripe settings for spot owner
    const stripeSettings = db.stripes.findByUserId(spot.user_id);
    
    if (!stripeSettings || !stripeSettings.sk_key) {
      return res.redirect('/spot/' + spotGuid + '?error=payment_configuration&message=Seller+payment+configuration+is+incomplete');
    }
    
    // Verify payment with Stripe
    if (session_id) {
      try {
        // Initialize Stripe with the seller's secret key
        const stripe = Stripe(stripeSettings.sk_key);
        
        // Verify the session with Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        // Check if the payment was successful
        if (session.payment_status === 'paid') {
          // Clear the cookie
          res.clearCookie('spot_guid', { path: '/' });
          
          // Redirect to dashboard with success message
          return res.redirect('/dashboard?payment=success&spot=' + spotGuid);
        } else {
          // Payment was not completed successfully
          return res.redirect('/spot/' + spotGuid + '?payment=incomplete&message=Your+payment+is+being+processed');
        }
      } catch (stripeError) {
        console.error('Error verifying Stripe payment:', stripeError);
        return res.redirect('/spot/' + spotGuid + '?error=payment_verification&message=There+was+a+problem+verifying+your+payment');
      }
    } else {
      // No session ID, payment might have been cancelled
      return res.redirect('/spot/' + spotGuid + '?payment=cancelled&message=Your+payment+was+cancelled');
    }
    
  } catch (error) {
    console.error('Error processing payment callback:', error);
    res.redirect('/spot/' + spotGuid + '?error=server_error&message=A+server+error+occurred');
  }
});

// Webhook endpoint for Stripe to notify about payment events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    // Retrieve webhook secret from environment variable
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    let stripeSecretKey;
    
    // For demo purposes, use the first available stripe settings
    // In production, you would have a single platform Stripe account
    const anyStripeSettings = db.sqlite.prepare('SELECT * FROM stripes LIMIT 1').get();
    if (anyStripeSettings && anyStripeSettings.sk_key) {
      stripeSecretKey = anyStripeSettings.sk_key;
    } else {
      // Fall back to env variable if no settings in DB
      stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    }
    
    if (!stripeSecretKey) {
      console.error('No Stripe secret key available');
      return res.status(500).json({ error: 'Stripe configuration missing' });
    }
    
    // Initialize Stripe
    const stripe = Stripe(stripeSecretKey);
    
    if (endpointSecret) {
      // Verify the webhook signature
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // Without a secret, just parse the event
      try {
        event = JSON.parse(req.body.toString());
      } catch (err) {
        console.error(`Error parsing webhook payload: ${err.message}`);
        return res.status(400).json({ error: 'Invalid payload' });
      }
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Extract spot GUID from metadata (should be set when creating checkout session)
        const spotGuid = session.metadata?.spot_guid;
        
        if (!spotGuid) {
          console.error('No spot_guid in session metadata');
          return res.status(200).json({ received: true });
        }
        
        // Find the spot
        const spot = db.spots.findByGuid(spotGuid);
        
        if (!spot) {
          console.error(`Spot not found for guid: ${spotGuid}`);
          return res.status(200).json({ received: true });
        }
        
        // Check if the payment was successful
        if (session.payment_status === 'paid') {
          console.log(`Payment successful for spot: ${spotGuid}`);
          
          // Here you could update the spot status in the database
          // For example, mark it as paid, activate features, etc.
          
          // You could also send an email to the user, etc.
        }
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Extract metadata if needed similar to checkout.session.completed
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.error(`Payment failed for PaymentIntent: ${failedPaymentIntent.id}`);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    // Always return 200 for webhooks to prevent Stripe from retrying
    res.status(200).json({ received: true, error: error.message });
  }
});

module.exports = router;
