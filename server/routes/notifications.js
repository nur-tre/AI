import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET USER NOTIFICATIONS
router.get('/', authenticateToken, (req, res) => {
  try {
    const list = db
      .collection('notifications')
      .find({ userId: req.user.id })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = list.filter(n => !n.read).length;

    res.json({ notifications: list, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
});

// MARK SINGLE NOTIFICATION READ
router.put('/:id/read', authenticateToken, (req, res) => {
  try {
    const notif = db.collection('notifications').findOne({ id: req.params.id, userId: req.user.id });
    if (!notif) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    const updated = db.collection('notifications').update(notif.id, { read: true });
    res.json({ notification: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification.' });
  }
});

// MARK ALL READ
router.put('/read-all', authenticateToken, (req, res) => {
  try {
    const notifs = db.collection('notifications').find({ userId: req.user.id, read: false });
    notifs.forEach(n => {
      db.collection('notifications').update(n.id, { read: true });
    });

    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notifications read.' });
  }
});

// DELETE NOTIFICATION
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.collection('notifications').delete(req.params.id);
    res.json({ message: 'Notification deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification.' });
  }
});

export default router;
