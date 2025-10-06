import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000; // Backend runs on port 5000

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON request bodies

// In-memory storage for users (simulating a database)
let users = [];

// Route 1: GET - Fetch all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Route 2: POST - Add new user
app.post('/api/users', (req, res) => {
  const { username, age } = req.body;
  
  // Simple validation
  if (!username || !age) {
    return res.status(400).json({ message: 'Username and age are required' });
  }
  
  const newUser = { username, age };
  users.push(newUser);
  
  res.status(201).json({ 
    message: 'User added successfully!', 
    user: newUser 
  });
});

// Route 3: GET - Welcome route (testing)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the User API!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});