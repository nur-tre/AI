import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET GAMIFICATION STATS
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const user = db.collection('users').findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const allAchievements = db.collection('achievements').find();
    const unlockedMap = db
      .collection('user_achievements')
      .find({ userId: req.user.id })
      .reduce((acc, ua) => {
        acc[ua.achievementId] = ua.unlockedAt;
        return acc;
      }, {});

    const achievementsWithStatus = allAchievements.map(ach => ({
      ...ach,
      unlocked: Boolean(unlockedMap[ach.id]),
      unlockedAt: unlockedMap[ach.id] || null
    }));

    // Weekly activity data (Mon - Sun hours)
    const weeklyActivity = [
      { day: 'Mon', hours: 2.2, xp: 180 },
      { day: 'Tue', hours: 3.5, xp: 260 },
      { day: 'Wed', hours: 1.8, xp: 140 },
      { day: 'Thu', hours: 4.0, xp: 320 },
      { day: 'Fri', hours: 2.9, xp: 210 },
      { day: 'Sat', hours: 3.8, xp: 290 },
      { day: 'Sun', hours: 1.5, xp: 120 }
    ];

    // Calculate level progression
    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;
    const xpForCurrentLevel = (currentLevel - 1) * 400;
    const xpForNextLevel = currentLevel * 400;
    const levelProgress = Math.min(
      100,
      Math.round(((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel || 400)) * 100)
    );

    res.json({
      xp: currentXp,
      level: currentLevel,
      streak: user.streak || 1,
      totalHours: user.totalHours || 0,
      xpForNextLevel,
      levelProgress: Math.max(0, levelProgress),
      achievements: achievementsWithStatus,
      weeklyActivity
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gamification stats.' });
  }
});

// GET LEADERBOARD
router.get('/leaderboard', (req, res) => {
  try {
    const students = db
      .collection('users')
      .find({ role: 'student' })
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .slice(0, 20)
      .map((s, index) => ({
        rank: index + 1,
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        xp: s.xp || 0,
        level: s.level || 1,
        streak: s.streak || 1
      }));

    res.json({ leaderboard: students });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving leaderboard.' });
  }
});

export default router;
