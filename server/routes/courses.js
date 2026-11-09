import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET ALL COURSES WITH SEARCH & FILTERS
router.get('/', (req, res) => {
  try {
    const { search, subject, difficulty, language, sortBy = 'rating' } = req.query;
    let courses = db.collection('courses').find();

    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.instructorName.toLowerCase().includes(q)
      );
    }

    if (subject && subject !== 'All') {
      courses = courses.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      courses = courses.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (language && language !== 'All') {
      courses = courses.filter(c => c.language === language);
    }

    if (sortBy === 'rating') {
      courses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popular') {
      courses.sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0));
    } else if (sortBy === 'newest') {
      courses.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    res.json({ courses, total: courses.length });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving courses.' });
  }
});

// GET SINGLE COURSE DETAIL
router.get('/:id', (req, res) => {
  try {
    const course = db.collection('courses').findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const lessons = db
      .collection('lessons')
      .find({ courseId: course.id })
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const quizzes = db.collection('quizzes').find({ courseId: course.id });

    // Related courses in same subject
    const related = db
      .collection('courses')
      .find(c => c.subject === course.subject && c.id !== course.id)
      .slice(0, 3);

    res.json({
      course,
      lessons,
      quizzes,
      related
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course details.' });
  }
});

// ENROLL IN COURSE
router.post('/:id/enroll', authenticateToken, (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = db.collection('courses').findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const progressCol = db.collection('user_progress');
    let record = progressCol.findOne({ userId, courseId });

    if (!record) {
      record = progressCol.insert({
        userId,
        courseId,
        completedLessons: [],
        progressPercentage: 0,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      });

      // Award enrollment XP
      const usersCol = db.collection('users');
      const user = usersCol.findById(userId);
      if (user) {
        usersCol.update(userId, { xp: (user.xp || 0) + 50 });
      }

      // Add notification
      db.collection('notifications').insert({
        userId,
        title: `Enrolled: ${course.title}`,
        message: 'You have successfully enrolled in this course. Happy learning!',
        type: 'course',
        read: false
      });
    }

    res.json({ message: 'Enrolled successfully', progress: record });
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling in course.' });
  }
});

// GET LESSON DETAIL
router.get('/:courseId/lessons/:lessonId', authenticateToken, (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const lesson = db.collection('lessons').findOne({ id: lessonId, courseId });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const allCourseLessons = db
      .collection('lessons')
      .find({ courseId })
      .sort((a, b) => a.order - b.order);

    const currentIndex = allCourseLessons.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allCourseLessons.length - 1 ? allCourseLessons[currentIndex + 1] : null;

    const progress = db.collection('user_progress').findOne({ userId: req.user.id, courseId });
    const isCompleted = progress?.completedLessons?.includes(lessonId) || false;

    res.json({
      lesson,
      prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
      isCompleted
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lesson.' });
  }
});

// COMPLETE LESSON
router.post('/:courseId/lessons/:lessonId/complete', authenticateToken, (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;

    const progressCol = db.collection('user_progress');
    let record = progressCol.findOne({ userId, courseId });

    const totalLessons = db.collection('lessons').find({ courseId }).length || 1;

    let completed = record?.completedLessons || [];
    let isNewCompletion = false;

    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      isNewCompletion = true;
    }

    const progressPercentage = Math.min(100, Math.round((completed.length / totalLessons) * 100));

    if (record) {
      progressCol.update(record.id, {
        completedLessons: completed,
        progressPercentage,
        lastAccessedAt: new Date().toISOString()
      });
    } else {
      progressCol.insert({
        userId,
        courseId,
        completedLessons: completed,
        progressPercentage,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      });
    }

    // Award XP and increment hours if newly completed
    if (isNewCompletion) {
      const usersCol = db.collection('users');
      const user = usersCol.findById(userId);
      if (user) {
        const newXp = (user.xp || 0) + 75;
        const newHours = Number(((user.totalHours || 0) + 0.5).toFixed(1));
        const newLevel = Math.floor(newXp / 400) + 1;
        usersCol.update(userId, {
          xp: newXp,
          totalHours: newHours,
          level: newLevel
        });
      }
    }

    res.json({
      message: 'Lesson marked as completed',
      completedLessons: completed,
      progressPercentage
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating lesson progress.' });
  }
});

// RATE COURSE
router.post('/:id/rate', authenticateToken, (req, res) => {
  try {
    const { rating } = req.body;
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const coursesCol = db.collection('courses');
    const course = coursesCol.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const currentCount = course.ratingsCount || 0;
    const currentRating = course.rating || 5.0;
    const updatedRating = Number(((currentRating * currentCount + numRating) / (currentCount + 1)).toFixed(2));

    coursesCol.update(course.id, {
      rating: updatedRating,
      ratingsCount: currentCount + 1
    });

    res.json({ message: 'Rating submitted successfully', newRating: updatedRating });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting rating.' });
  }
});

export default router;
