import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

// ADMIN STATS
router.get('/stats', (req, res) => {
  try {
    const totalUsers = db.collection('users').count();
    const students = db.collection('users').find({ role: 'student' });
    const teachers = db.collection('users').find({ role: 'teacher' });
    const admins = db.collection('users').find({ role: 'admin' });

    const totalCourses = db.collection('courses').count();
    const totalLessons = db.collection('lessons').count();
    const totalQuizzes = db.collection('quizzes').count();
    const totalQuizResults = db.collection('quiz_results').count();
    const totalDocuments = db.collection('documents').count();
    const settings = db.getSettings();

    // Average quiz score
    const allResults = db.collection('quiz_results').find();
    const avgScore = allResults.length > 0
      ? Math.round(allResults.reduce((acc, r) => acc + (r.score || 0), 0) / allResults.length)
      : 84;

    res.json({
      totalUsers,
      studentCount: students.length,
      teacherCount: teachers.length,
      adminCount: admins.length,
      totalCourses,
      totalLessons,
      totalQuizzes,
      totalQuizResults,
      avgQuizScore: avgScore,
      totalDocuments,
      settings
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admin statistics.' });
  }
});

// LIST ALL USERS
router.get('/users', (req, res) => {
  try {
    const { role, search } = req.query;
    let users = db.collection('users').find();

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role);
    }

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const safeUsers = users.map(({ password, ...u }) => u);
    res.json({ users: safeUsers });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// CREATE USER (ADMIN)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = db.collection('users').findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = db.collection('users').insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      xp: 100,
      level: 1,
      streak: 1,
      preferredLanguage: 'en',
      learningLevel: 'intermediate',
      bio: 'New member of EduAI.'
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: 'User created successfully', user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user.' });
  }
});

// UPDATE USER
router.put('/users/:id', async (req, res) => {
  try {
    const user = db.collection('users').findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { name, email, role, password, xp, level } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (role) updates.role = role;
    if (xp !== undefined) updates.xp = Number(xp);
    if (level !== undefined) updates.level = Number(level);
    if (password && password.trim().length >= 6) {
      updates.password = await bcrypt.hash(password.trim(), 10);
    }

    const updated = db.collection('users').update(user.id, updates);
    const { password: _, ...safeUser } = updated;
    res.json({ message: 'User updated successfully', user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user.' });
  }
});

// DELETE USER
router.delete('/users/:id', (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const success = db.collection('users').delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

// GET & UPDATE PLATFORM SETTINGS
router.get('/settings', (req, res) => {
  res.json({ settings: db.getSettings() });
});

router.put('/settings', (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ message: 'Platform settings updated successfully', settings: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update platform settings.' });
  }
});

export default router;
