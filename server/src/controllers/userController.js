import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// PUT /api/users/profile  (protected)
export const updateProfile = asyncHandler(async (req, res) => {
  const { username, phone, avatar } = req.body;
  const user = req.user;

  if (username && username !== user.username) {
    const taken = await User.findOne({ username });
    if (taken) return res.status(400).json({ message: 'That username is already taken' });
    user.username = username;
  }
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();
  res.json({ user: user.toSafeObject() });
});

// PUT /api/users/password  (protected)
// Verifies the current password before allowing a change.
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  const user = await User.findById(req.user._id).select('+password');
  const ok = await user.matchPassword(currentPassword);
  if (!ok) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword; // hashed by the pre-save hook
  await user.save();

  res.json({ message: 'Password updated successfully' });
});
