import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import middleware from '../middleware/middleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretkeyofnoteapp123@#';
const TOKEN_EXPIRES = '5h';

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Auth API OK' });
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name = '', email = '', password = '' } = req.body;
    if (!name.trim() || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Error in adding user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not exists' });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ success: false, message: 'Wrong credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Login successfully'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Error in Login server' });
  }
});

// Verify (protected)
router.get('/verify', middleware, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});

export default router;
