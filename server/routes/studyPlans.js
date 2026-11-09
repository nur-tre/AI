import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET USER STUDY PLANS
router.get('/', authenticateToken, (req, res) => {
  try {
    const plans = db
      .collection('study_plans')
      .find({ userId: req.user.id })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    res.json({ plans });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching study plans.' });
  }
});

// CREATE STUDY PLAN ITEM
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, subject, dueDate, priority = 'medium', estimatedMinutes = 30 } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required.' });
    }

    const newPlan = db.collection('study_plans').insert({
      userId: req.user.id,
      title: title.trim(),
      subject: subject || 'General',
      dueDate,
      priority,
      status: 'pending',
      estimatedMinutes: Number(estimatedMinutes) || 30
    });

    res.status(201).json({ plan: newPlan });
  } catch (err) {
    res.status(500).json({ message: 'Error creating study plan task.' });
  }
});

// UPDATE STUDY PLAN (TOGGLE STATUS / EDIT)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const plan = db.collection('study_plans').findOne({ id: req.params.id, userId: req.user.id });
    if (!plan) {
      return res.status(404).json({ message: 'Study plan not found.' });
    }

    const { status, title, dueDate, priority, estimatedMinutes } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (title) updates.title = title;
    if (dueDate) updates.dueDate = dueDate;
    if (priority) updates.priority = priority;
    if (estimatedMinutes) updates.estimatedMinutes = Number(estimatedMinutes);

    const updated = db.collection('study_plans').update(plan.id, updates);

    // Reward XP when marked completed
    if (status === 'completed' && plan.status !== 'completed') {
      const usersCol = db.collection('users');
      const user = usersCol.findById(req.user.id);
      if (user) {
        usersCol.update(user.id, { xp: (user.xp || 0) + 30 });
      }
    }

    res.json({ plan: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating study plan.' });
  }
});

// DELETE STUDY PLAN
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const success = db.collection('study_plans').delete(req.params.id);
    res.json({ success, message: 'Study task deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting study task.' });
  }
});

// AI STUDY SCHEDULE GENERATOR
router.post('/generate-ai', authenticateToken, async (req, res) => {
  try {
    const { targetExamOrGoal, availableHoursPerDay = 2, focusSubjects = [] } = req.body;
    const today = new Date();

    const sampleSubjects = focusSubjects.length > 0 ? focusSubjects : ['Programming', 'Mathematics', 'Physics'];

    const newTasks = [];
    for (let i = 0; i < 5; i++) {
      const targetDate = new Date(today.getTime() + i * 86400000).toISOString().split('T')[0];
      const subj = sampleSubjects[i % sampleSubjects.length];

      const task = db.collection('study_plans').insert({
        userId: req.user.id,
        title: `AI Goal: ${subj} - Deep Concept Review & Practical Exercises`,
        subject: subj,
        dueDate: targetDate,
        priority: i === 0 ? 'high' : 'medium',
        status: 'pending',
        estimatedMinutes: Math.round((Number(availableHoursPerDay) || 2) * 45)
      });
      newTasks.push(task);
    }

    res.json({
      message: 'Personalized AI study schedule generated successfully!',
      tasks: newTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating AI study schedule.' });
  }
});

export default router;
