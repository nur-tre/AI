import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('teacher', 'admin'));

// TEACHER DASHBOARD OVERVIEW
router.get('/overview', (req, res) => {
  try {
    const isTeacher = req.user.role === 'teacher';
    const courseQuery = isTeacher ? { instructorId: req.user.id } : {};

    const courses = db.collection('courses').find(courseQuery);
    const courseIds = courses.map(c => c.id);

    const totalStudents = db
      .collection('user_progress')
      .find(p => courseIds.includes(p.courseId))
      .map(p => p.userId);
    const uniqueStudents = new Set(totalStudents).size;

    const quizzes = db.collection('quizzes').find(q => courseIds.includes(q.courseId));
    const assignments = db.collection('assignments').find(a => courseIds.includes(a.courseId));
    const submissions = db.collection('assignment_submissions').find();

    res.json({
      totalCourses: courses.length,
      totalStudents: uniqueStudents,
      totalQuizzes: quizzes.length,
      totalAssignments: assignments.length,
      recentSubmissions: submissions.slice(0, 5),
      courses
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving teacher overview.' });
  }
});

// CREATE COURSE
router.post('/courses', (req, res) => {
  try {
    const { title, subject, category, difficulty, duration, description, objectives, thumbnail, language = 'en' } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ message: 'Title and subject are required.' });
    }

    const newCourse = db.collection('courses').insert({
      title: title.trim(),
      subject,
      category: category || subject,
      difficulty: difficulty || 'Intermediate',
      duration: duration || '10 hours',
      description: description || '',
      objectives: Array.isArray(objectives) ? objectives : [objectives || 'Master key principles'],
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      instructorId: req.user.id,
      instructorName: req.user.name,
      rating: 5.0,
      ratingsCount: 1,
      language,
      lessonsCount: 0
    });

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course.' });
  }
});

// EDIT COURSE
router.put('/courses/:id', (req, res) => {
  try {
    const course = db.collection('courses').findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this course.' });
    }

    const { title, subject, category, difficulty, duration, description, objectives, thumbnail } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (subject) updates.subject = subject;
    if (category) updates.category = category;
    if (difficulty) updates.difficulty = difficulty;
    if (duration) updates.duration = duration;
    if (description !== undefined) updates.description = description;
    if (objectives) updates.objectives = Array.isArray(objectives) ? objectives : [objectives];
    if (thumbnail) updates.thumbnail = thumbnail;

    const updated = db.collection('courses').update(course.id, updates);
    res.json({ message: 'Course updated successfully', course: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course.' });
  }
});

// DELETE COURSE
router.delete('/courses/:id', (req, res) => {
  try {
    const course = db.collection('courses').findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    if (req.user.role !== 'admin' && course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this course.' });
    }

    // Delete course and its associated lessons and quizzes
    db.collection('courses').delete(course.id);
    db.collection('lessons').deleteMany({ courseId: course.id });
    db.collection('quizzes').deleteMany({ courseId: course.id });

    res.json({ message: 'Course and related lessons deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course.' });
  }
});

// ADD LESSON TO COURSE
router.post('/courses/:courseId/lessons', (req, res) => {
  try {
    const course = db.collection('courses').findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const { title, duration, videoUrl, content, resources } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Lesson title and content are required.' });
    }

    const existingLessons = db.collection('lessons').find({ courseId: course.id });
    const order = existingLessons.length + 1;

    const newLesson = db.collection('lessons').insert({
      courseId: course.id,
      title: title.trim(),
      duration: duration || '20 min',
      videoUrl: videoUrl || '',
      content: content.trim(),
      order,
      resources: Array.isArray(resources) ? resources : []
    });

    db.collection('courses').update(course.id, { lessonsCount: order });

    res.status(201).json({ message: 'Lesson added successfully', lesson: newLesson });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add lesson.' });
  }
});

// EDIT LESSON
router.put('/lessons/:lessonId', (req, res) => {
  try {
    const lesson = db.collection('lessons').findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const { title, duration, videoUrl, content, resources } = req.body;
    const updates = {};
    if (title) updates.title = title.trim();
    if (duration) updates.duration = duration;
    if (videoUrl !== undefined) updates.videoUrl = videoUrl;
    if (content) updates.content = content;
    if (resources) updates.resources = resources;

    const updated = db.collection('lessons').update(lesson.id, updates);
    res.json({ message: 'Lesson updated successfully', lesson: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update lesson.' });
  }
});

// DELETE LESSON
router.delete('/lessons/:lessonId', (req, res) => {
  try {
    const lesson = db.collection('lessons').findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    db.collection('lessons').delete(lesson.id);

    // Update course lesson count
    const remaining = db.collection('lessons').find({ courseId: lesson.courseId }).length;
    db.collection('courses').update(lesson.courseId, { lessonsCount: remaining });

    res.json({ message: 'Lesson deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete lesson.' });
  }
});

// CREATE ASSIGNMENT
router.post('/assignments', (req, res) => {
  try {
    const { courseId, title, description, dueDate, totalPoints = 100 } = req.body;
    if (!courseId || !title || !dueDate) {
      return res.status(400).json({ message: 'Course, title, and due date are required.' });
    }

    const assignment = db.collection('assignments').insert({
      courseId,
      instructorId: req.user.id,
      title: title.trim(),
      description: description || '',
      dueDate,
      totalPoints: Number(totalPoints)
    });

    res.status(201).json({ assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating assignment.' });
  }
});

// GET ASSIGNMENTS
router.get('/assignments', (req, res) => {
  try {
    const list = db.collection('assignments').find();
    res.json({ assignments: list });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assignments.' });
  }
});

// TRACK STUDENT PROGRESS FOR A COURSE
router.get('/courses/:courseId/students', (req, res) => {
  try {
    const courseId = req.params.courseId;
    const progressList = db.collection('user_progress').find({ courseId });

    const studentDetails = progressList.map(p => {
      const student = db.collection('users').findById(p.userId);
      return {
        id: p.userId,
        name: student?.name || 'Unknown Student',
        email: student?.email || '',
        avatar: student?.avatar,
        progressPercentage: p.progressPercentage || 0,
        completedLessonsCount: p.completedLessons?.length || 0,
        lastAccessedAt: p.lastAccessedAt
      };
    });

    res.json({ students: studentDetails });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving student progress.' });
  }
});

export default router;
