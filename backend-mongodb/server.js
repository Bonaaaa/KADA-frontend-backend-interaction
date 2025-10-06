import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB with Mongoose!'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Define User Schema (structure of data)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age must be less than 120']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create User Model (represents the collection)
const User = mongoose.model('User', userSchema);

// Route 1: GET - Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the User API with Mongoose!' });
});

// Route 2: GET - Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Route 3: POST - Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { username, age } = req.body;
    
    // Create new user with Mongoose model
    const newUser = new User({
      username,
      age
    });
    
    // Save to MongoDB (validation happens automatically)
    await newUser.save();
    
    res.status(201).json({ 
      message: 'User added successfully with Mongoose!', 
      user: newUser
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});