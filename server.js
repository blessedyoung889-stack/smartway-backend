// server.js - Smart Way Express Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartway';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Database'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// SCHEMAS & MODELS
// ==========================================

// User Schema (Admins, Staff, Gate Scanners)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'gate'], default: 'admin' },
  schoolName: String,
  email: String
});
const User = mongoose.model('User', userSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  gender: String,
  address: String,
  guardianName: String,
  guardianPhone: String,
  className: { type: String, default: 'Form 1A' },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
  arrivalTime: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', studentSchema);

// ==========================================
// API ROUTES
// ==========================================

// 1. Admin Registration Route
app.post('/api/register-admin', async (req, res) => {
  try {
    const { username, password, schoolName, email } = req.body;
    const newUser = new User({ username, password, role: 'admin', schoolName, email });
    await newUser.save();
    res.status(201).json({ message: 'Admin registered successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. User Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, password, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username, password, or role' });
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get All Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ arrivalTime: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Register a New Student
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Serve Front-End files (If placing index.html in a 'public' folder)
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Smart Way Server running on port ${PORT}`);
});
