import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { seedDatabase } from './config/seed.js';
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import quizzesRoutes from './routes/quizzes.js';
import aiRoutes from './routes/ai.js';
import studyPlansRoutes from './routes/studyPlans.js';
import flashcardsRoutes from './routes/flashcards.js';
import documentsRoutes from './routes/documents.js';
import gamificationRoutes from './routes/gamification.js';
import notificationsRoutes from './routes/notifications.js';
import teacherRoutes from './routes/teacher.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'EduAI',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/study-plans', studyPlansRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server and Seed Database
async function start() {
  try {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`\n==========================================`);
      console.log(`🚀 EduAI Backend running on http://localhost:${PORT}`);
      console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`==========================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
