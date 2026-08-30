const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.send('SmartWay Backend is running successfully!');
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
