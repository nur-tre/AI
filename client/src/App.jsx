import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GlobalSearchModal from './components/GlobalSearchModal';
import NotificationDrawer from './components/NotificationDrawer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AITutorPage from './pages/AITutorPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewPage from './pages/LessonViewPage';
import QuizArenaPage from './pages/QuizArenaPage';
import QuizTakingPage from './pages/QuizTakingPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import FlashcardsPage from './pages/FlashcardsPage';
import DocumentSummarizerPage from './pages/DocumentSummarizerPage';
import GamificationPage from './pages/GamificationPage';
import ProfilePage from './pages/ProfilePage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Authenticating session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// App Layout Shell
function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotifOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar />}

        <main className={`flex-1 ${showSidebar ? 'p-4 sm:p-6 lg:p-8 max-w-7xl' : ''}`}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />

            {/* Authenticated Learning */}
            <Route path="/dashboard" element={
              <ProtectedRoute><StudentDashboard /></ProtectedRoute>
            } />
            <Route path="/tutor" element={
              <ProtectedRoute><AITutorPage /></ProtectedRoute>
            } />
            <Route path="/courses/:courseId/lessons/:lessonId" element={
              <ProtectedRoute><LessonViewPage /></ProtectedRoute>
            } />
            <Route path="/quizzes" element={
              <ProtectedRoute><QuizArenaPage /></ProtectedRoute>
            } />
            <Route path="/quizzes/:id" element={
              <ProtectedRoute><QuizTakingPage /></ProtectedRoute>
            } />
            <Route path="/planner" element={
              <ProtectedRoute><StudyPlannerPage /></ProtectedRoute>
            } />
            <Route path="/flashcards" element={
              <ProtectedRoute><FlashcardsPage /></ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute><DocumentSummarizerPage /></ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute><GamificationPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />

            {/* Role Guarded: Teacher */}
            <Route path="/teacher" element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>
            } />

            {/* Role Guarded: Admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <NotificationDrawer
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        onCountChange={setUnreadCount}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
