import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = express.Router();

// GET ALL QUIZZES
router.get('/', (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    let quizzes = db.collection('quizzes').find();

    if (subject && subject !== 'All') {
      quizzes = quizzes.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      quizzes = quizzes.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Sanitize correct answers for listing
    const summary = quizzes.map(q => ({
      id: q.id,
      title: q.title,
      subject: q.subject,
      difficulty: q.difficulty,
      timeLimitMinutes: q.timeLimitMinutes || 15,
      questionsCount: q.questions?.length || 0,
      xpReward: q.xpReward || 100
    }));

    res.json({ quizzes: summary });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quizzes.' });
  }
});

// GET SINGLE QUIZ TO TAKE
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const quiz = db.collection('quizzes').findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Return questions with options, but hide answers during test taking
    const clientQuestions = quiz.questions.map((q, idx) => ({
      id: q.id || `q_${idx}`,
      type: q.type,
      question: q.question,
      options: q.options || []
    }));

    res.json({
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timeLimitMinutes: quiz.timeLimitMinutes || 15,
      questions: clientQuestions
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quiz.' });
  }
});

// AI GENERATE QUIZ
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { subject, topic, difficulty, questionCount = 5, language = 'en' } = req.body;

    if (!subject) {
      return res.status(400).json({ message: 'Subject is required for quiz generation.' });
    }

    const generated = await AIService.generateQuiz({
      subject,
      topic,
      difficulty: difficulty || 'Intermediate',
      questionCount: Number(questionCount) || 5,
      language
    });

    const newQuiz = db.collection('quizzes').insert({
      title: generated.title,
      subject: generated.subject,
      difficulty: generated.difficulty,
      timeLimitMinutes: Math.max(10, (generated.questions?.length || 5) * 3),
      passingScore: 70,
      xpReward: 150,
      questions: generated.questions,
      createdBy: req.user.id,
      isAiGenerated: true
    });

    res.status(201).json({
      message: 'AI Quiz generated successfully',
      quiz: newQuiz
    });
  } catch (err) {
    console.error('AI Quiz generation error:', err);
    res.status(500).json({ message: 'Failed to generate AI quiz.' });
  }
});

// SUBMIT QUIZ ATTEMPT
router.post('/:id/submit', authenticateToken, (req, res) => {
  try {
    const { answers, timeSpentSeconds } = req.body;
    const quiz = db.collection('quizzes').findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const detailedResults = [];

    quiz.questions.forEach((q) => {
      const userAnswer = answers?.[q.id];
      let isCorrect = false;

      if (q.type === 'multiple_choice' || q.type === 'true_false') {
        isCorrect = String(userAnswer || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase();
      } else if (q.type === 'written') {
        // Written answer semantic match: check for meaningful length and keyword overlap
        const expectedWords = String(q.correctAnswer || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const given = String(userAnswer || '').toLowerCase();
        const matches = expectedWords.filter(w => given.includes(w));
        isCorrect = matches.length >= 1 || given.length > 25;
      }

      if (isCorrect) correctCount++;

      detailedResults.push({
        questionId: q.id,
        question: q.question,
        type: q.type,
        userAnswer: userAnswer || 'Not answered',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || 'No explanation provided.'
      });
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= (quiz.passingScore || 70);
    const earnedXp = passed ? (quiz.xpReward || 100) : Math.round((quiz.xpReward || 100) * 0.3);

    const submission = db.collection('quiz_results').insert({
      userId: req.user.id,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score,
      correctCount,
      totalQuestions,
      passed,
      timeSpentSeconds: timeSpentSeconds || 0,
      earnedXp,
      detailedResults,
      submittedAt: new Date().toISOString()
    });

    // Update User XP and check achievements
    const usersCol = db.collection('users');
    const user = usersCol.findById(req.user.id);
    if (user) {
      const newXp = (user.xp || 0) + earnedXp;
      const newLevel = Math.floor(newXp / 400) + 1;
      usersCol.update(user.id, { xp: newXp, level: newLevel });

      if (score >= 90) {
        db.collection('user_achievements').insert({
          userId: user.id,
          achievementId: 'ach_quiz_master',
          unlockedAt: new Date().toISOString()
        });
      }
    }

    // Add notification
    db.collection('notifications').insert({
      userId: req.user.id,
      title: `Quiz Finished: ${quiz.title}`,
      message: `You scored ${score}% (${correctCount}/${totalQuestions}). Earned +${earnedXp} XP!`,
      type: 'quiz',
      read: false
    });

    res.json({
      score,
      correctCount,
      totalQuestions,
      passed,
      earnedXp,
      detailedResults,
      submissionId: submission.id
    });
  } catch (err) {
    console.error('Quiz submission error:', err);
    res.status(500).json({ message: 'Error processing quiz submission.' });
  }
});

// GET USER QUIZ HISTORY
router.get('/history/my', authenticateToken, (req, res) => {
  try {
    const history = db
      .collection('quiz_results')
      .find({ userId: req.user.id })
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quiz history.' });
  }
});

export default router;
