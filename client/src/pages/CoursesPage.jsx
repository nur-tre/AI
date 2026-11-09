import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function CoursesPage() {
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);

  const subjects = ['All', 'Programming', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Geography'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (subject !== 'All') params.subject = subject;
        if (difficulty !== 'All') params.difficulty = difficulty;
        if (sortBy) params.sortBy = sortBy;

        const res = await api.get('/courses', { params });
        setCourses(res.data.courses || []);
      } catch (err) {
        console.warn('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchCourses();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, subject, difficulty, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Curriculum Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore Academic Courses & Interactive Lectures
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive curricula designed by world-class educators, coupled with personalized AI tutoring for every topic.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses by keyword, topic, or professor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="popular">Most Enrolled</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-1">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-colors ${
                subject === s
                  ? 'bg-brand-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : courses.length > 0 ? (
          courses.map(course => (
            <div
              key={course.id}
              className="group bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden card-hover flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-navy-900/90 text-brand-600 dark:text-brand-400 backdrop-blur-md shadow-xs">
                      {course.subject}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{course.rating}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mb-1.5">
                    <span>{course.difficulty}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-navy-800 flex items-center justify-center text-brand-600 font-bold text-[10px]">
                      {course.instructorName?.charAt(0) || 'P'}
                    </div>
                    <span className="truncate">{course.instructorName}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{course.lessonsCount || 3} Lessons</span>
                </span>
                <Link
                  to={`/courses/${course.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center space-x-1 transition-colors"
                >
                  <span>View Course</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            No courses found matching your criteria. Try adjusting the search filters.
          </div>
        )}
      </div>

    </div>
  );
}
