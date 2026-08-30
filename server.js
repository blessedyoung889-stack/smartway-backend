const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Base live API URL variable for your reference:
// https://smartway-backend-1.onrender.com

// Root Route (Displays live status)
app.get('/', (req, res) => {
  res.send('SmartWay Backend is running successfully!');
});

// Example API Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend API is connected to Render successfully.'
  });
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGO_URI provided in environment variables.');
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
