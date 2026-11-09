import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle2, 
  Play, 
  Award, 
  ChevronRight, 
  ArrowLeft, 
  Share2, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        setCourseData(res.data);
      } catch (err) {
        console.warn('Failed to load course detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await api.post(`/courses/${id}/enroll`);
      setEnrolled(true);
    } catch (err) {
      console.warn('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading course curriculum...
      </div>
    );
  }

  if (!courseData?.course) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Course not found.
      </div>
    );
  }

  const { course, lessons = [], related = [] } = courseData;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Back button */}
      <Link
        to="/courses"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Courses Catalog</span>
      </Link>

      {/* Course Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
              {course.subject}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
              {course.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center space-x-1 font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{course.rating} ({course.ratingsCount || 80}+ reviews)</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{course.duration}</span>
            </span>
            <span>•</span>
            <span>Instructor: <strong className="text-slate-800 dark:text-slate-200">{course.instructorName}</strong></span>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={handleEnroll}
              disabled={enrolling || enrolled}
              className={`px-7 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 ${
                enrolled
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 hover:-translate-y-0.5'
              }`}
            >
              {enrolled ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Enrolled & Ready</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{enrolling ? 'Enrolling...' : 'Enroll in Course (Earn +50 XP)'}</span>
                </>
              )}
            </button>

            {lessons.length > 0 && (
              <Link
                to={`/courses/${course.id}/lessons/${lessons[0].id}`}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 dark:bg-navy-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start First Lesson</span>
              </Link>
            )}
          </div>
        </div>

        {/* Thumbnail Preview Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 h-64 lg:h-72">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Course Objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            What You Will Master in This Course
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.objectives.map((obj, i) => (
              <div key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Syllabus / Lessons Roster */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Course Syllabus & Interactive Lectures
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lessons.length} structured units with video instruction and practice notes
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="py-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-navy-800/50 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {lesson.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                    <span>{lesson.duration || '25 min'}</span>
                    <span>•</span>
                    <span className="text-brand-600 dark:text-brand-400">Interactive Lecture & AI Q&A</span>
                  </p>
                </div>
              </div>

              <Link
                to={`/courses/${course.id}/lessons/${lesson.id}`}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all flex items-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Launch</span>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
