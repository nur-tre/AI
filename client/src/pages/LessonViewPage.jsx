import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Bot, 
  BookOpen, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams();
  const { updateUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [course, setCourse] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);
        const [lRes, cRes] = await Promise.all([
          api.get(`/courses/${courseId}/lessons/${lessonId}`),
          api.get(`/courses/${courseId}`)
        ]);
        setLessonData(lRes.data);
        setIsCompleted(lRes.data.isCompleted || false);
        setCourse(cRes.data.course);
      } catch (err) {
        console.warn('Error loading lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [courseId, lessonId]);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      const res = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      setIsCompleted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });

      // Update local XP
      updateUser({ xp: (user => (user?.xp || 0) + 75) });
    } catch (err) {
      console.warn('Completion error:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading interactive lecture...
      </div>
    );
  }

  if (!lessonData?.lesson) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Lesson content not found.
      </div>
    );
  }

  const { lesson, prevLesson, nextLesson } = lessonData;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Nav Breadcrumbs & AI Quick Prompt */}
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {course?.title || 'Course'}</span>
        </Link>

        <Link
          to={`/tutor?prompt=${encodeURIComponent(`Explain key concepts from lesson: ${lesson.title}`)}`}
          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold flex items-center space-x-1.5 hover:bg-purple-100 transition-colors"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Ask AI About This Lesson</span>
        </Link>
      </div>

      {/* Video Player Container */}
      {lesson.videoUrl && (
        <div className="rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200 dark:border-slate-800 aspect-video relative">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Lesson Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Unit {lesson.order} • {lesson.duration || '25 min'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {lesson.title}
            </h1>
          </div>

          <button
            onClick={handleComplete}
            disabled={completing || isCompleted}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all flex-shrink-0 ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'Lesson Completed (+75 XP)' : 'Mark as Complete (+75 XP)'}</span>
          </button>
        </div>

        {/* Written Notes / Markdown Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line py-2">
          {lesson.content}
        </div>

        {/* Lesson Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Supplemental References & Reading
            </h3>
            <div className="space-y-2">
              {lesson.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{res.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Previous / Next Lesson Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
        {prevLesson ? (
          <Link
            to={`/courses/${courseId}/lessons/${prevLesson.id}`}
            className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[150px] sm:max-w-xs">{prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            to={`/courses/${courseId}/lessons/${nextLesson.id}`}
            className="flex items-center space-x-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <span className="truncate max-w-[150px] sm:max-w-xs">{nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

    </div>
  );
}
