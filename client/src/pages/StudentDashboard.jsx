import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  Bot, 
  Calendar, 
  Play, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { StatSkeleton, CardSkeleton } from '../components/LoadingSkeleton';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [gamification, setGamification] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [gamRes, coursesRes, plansRes] = await Promise.all([
          api.get('/gamification/stats'),
          api.get('/courses'),
          api.get('/study-plans')
        ]);
        setGamification(gamRes.data);
        setCourses(coursesRes.data.courses || []);
        setStudyPlans(plansRes.data.plans || []);
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const enrolledCourse = courses.find(c => c.id === 'course_prog_1') || courses[0];
  const pendingTasks = studyPlans.filter(p => p.status !== 'completed').slice(0, 3);
  const recentAchievements = gamification?.achievements?.filter(a => a.unlocked).slice(0, 4) || [];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>EduAI Adaptive Learning System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('welcomeBack')}, {user?.name?.split(' ')[0] || 'Learner'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 font-normal leading-relaxed">
            You are on a <span className="font-bold text-white">{gamification?.streak || user?.streak || 1}-day learning streak</span>. Maintain momentum today by finishing your scheduled tasks and quizzing your knowledge.
          </p>

          <div className="pt-3 flex flex-wrap gap-2.5">
            <Link
              to="/tutor"
              className="px-4 py-2 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </Link>
            <Link
              to="/quizzes"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs backdrop-blur-md transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Practice Quizzes</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner illustration */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            {/* Streak Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Streak</span>
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center text-orange-500">
                  <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {gamification?.streak || 1} <span className="text-xs font-normal text-slate-400">days</span>
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                <span>🔥 Active today</span>
              </p>
            </div>

            {/* Total Study Hours */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Hours</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-500">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {gamification?.totalHours || 24.5} <span className="text-xs font-normal text-slate-400">hrs</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Across 8 disciplines
              </p>
            </div>

            {/* Total XP & Level */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Level & XP</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-500">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                Level {gamification?.level || 1}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {gamification?.xp || 0} Total XP
              </p>
            </div>

            {/* Overall Progress */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Goal Progress</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-500">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                78%
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Grid: Weekly Activity Chart + Active Course Continuation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('weeklyLearningActivity')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Study hours logged across the current week
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
              This Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gamification?.weeklyActivity || []}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="h" />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Continue Learning Active Course Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {t('continueLearning')}
              </span>
              <span className="text-xs text-slate-400">In Progress</span>
            </div>

            {enrolledCourse && (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-36">
                  <img
                    src={enrolledCourse.thumbnail}
                    alt={enrolledCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-brand-600 text-white">
                      {enrolledCourse.subject}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {enrolledCourse.title}
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Lesson 2 of 4</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">50% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-600 h-2 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to={`/courses/${enrolledCourse?.id || 'course_prog_1'}/lessons/les_prog_2`}
            className="mt-5 w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm shadow-brand-500/25 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Resume Lesson</span>
          </Link>
        </div>
      </div>

      {/* Secondary Grid: Upcoming Study Tasks & Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Tasks */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('upcomingTasks')}
              </h3>
            </div>
            <Link to="/planner" className="text-xs font-semibold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {task.subject} • Due {task.dueDate} • {task.estimatedMinutes} min
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  task.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('recentAchievements')}
              </h3>
            </div>
            <Link to="/leaderboard" className="text-xs font-semibold text-brand-600 hover:underline">
              Leaderboard
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {recentAchievements.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {badge.title}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{badge.xpReward} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recommended Courses Carousel / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('recommendedForYou')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated by AI based on your favorite subjects
            </p>
          </div>
          <Link to="/courses" className="text-xs font-semibold text-brand-600 hover:underline flex items-center space-x-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.slice(1, 5).map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover flex flex-col justify-between"
            >
              <div>
                <div className="h-32 rounded-xl overflow-hidden mb-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>{course.subject}</span>
                  <span>{course.difficulty}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 transition-colors">
                  {course.title}
                </h4>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>{course.duration}</span>
                <span className="font-bold text-amber-500">★ {course.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
