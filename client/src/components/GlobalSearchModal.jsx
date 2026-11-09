import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Bot, CheckSquare, X, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.get('/courses').then(res => {
        setCourses(res.data.courses || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(courses.slice(0, 5));
      return;
    }

    const q = query.toLowerCase();
    const filtered = courses.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, courses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a subject, course, or keyword (e.g. Calculus, React, Physics)..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="ml-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-700/50">
          {results.length > 0 ? (
            results.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  navigate(`/courses/${course.id}`);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {course.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {course.subject} • {course.difficulty} • {course.instructorName}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching courses or topics found for "{query}".
            </div>
          )}
        </div>

        {/* Quick Footer Shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-navy-900/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search EduAI Global Knowledge Base</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
