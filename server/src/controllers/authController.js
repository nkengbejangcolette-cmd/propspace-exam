import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).json({ message: 'Email or username is already in use' });
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Password is select:false, so explicitly request it for comparison.
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    user: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});
