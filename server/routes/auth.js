import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eduai_super_secret_jwt_key_2026_education_platform';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', preferredLanguage = 'en', learningLevel = 'intermediate' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const usersCol = db.collection('users');
    const existing = usersCol.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = ['student', 'teacher'].includes(role) ? role : 'student';

    const newUser = usersCol.insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      xp: 100,
      level: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      preferredLanguage,
      learningLevel,
      favoriteSubjects: [],
      totalHours: 0,
      bio: `Hello! I am a passionate ${assignedRole} on EduAI.`
    });

    // Create welcome notification
    db.collection('notifications').insert({
      userId: newUser.id,
      title: 'Welcome to EduAI! 🚀',
      message: 'Explore courses, practice with AI Tutor, and track your daily streaks!',
      type: 'system',
      read: false
    });

    // Award welcome achievement
    db.collection('user_achievements').insert({
      userId: newUser.id,
      achievementId: 'ach_first_step',
      unlockedAt: new Date().toISOString()
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const usersCol = db.collection('users');
    const user = usersCol.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Update streak if needed
    const today = new Date().toISOString().split('T')[0];
    let streak = user.streak || 1;
    if (user.lastActiveDate) {
      const last = new Date(user.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays > 1) {
        streak = 1;
      }
    }

    usersCol.update(user.id, {
      lastActiveDate: today,
      streak
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password: _, ...safeUser } = { ...user, streak, lastActiveDate: today };
    res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', authenticateToken, (req, res) => {
  const user = db.collection('users').findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

// UPDATE PROFILE
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, bio, preferredLanguage, learningLevel, favoriteSubjects, avatar } = req.body;
    const usersCol = db.collection('users');

    const updates = {};
    if (name) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (learningLevel) updates.learningLevel = learningLevel;
    if (Array.isArray(favoriteSubjects)) updates.favoriteSubjects = favoriteSubjects;
    if (avatar) updates.avatar = avatar;

    const updated = usersCol.update(req.user.id, updates);
    const { password, ...safeUser } = updated;

    res.json({ message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

// CHANGE PASSWORD
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const usersCol = db.collection('users');
    const user = usersCol.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    usersCol.update(user.id, { password: hashed });

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password.' });
  }
});

// LOGOUT
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;
