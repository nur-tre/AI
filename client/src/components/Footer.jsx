import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Github, Twitter, Linkedin, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Edu<span className="text-brand-500">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering next-generation learners through cognitive science, personalized AI tutoring, and adaptive curriculum mastery.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Grade Security</span>
              </span>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Academic Subjects
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/courses?subject=Programming" className="hover:text-brand-500 transition-colors">Computer Science</Link></li>
              <li><Link to="/courses?subject=Mathematics" className="hover:text-brand-500 transition-colors">Advanced Mathematics</Link></li>
              <li><Link to="/courses?subject=Physics" className="hover:text-brand-500 transition-colors">Classical Physics</Link></li>
              <li><Link to="/courses?subject=Chemistry" className="hover:text-brand-500 transition-colors">Organic Chemistry</Link></li>
              <li><Link to="/courses?subject=Biology" className="hover:text-brand-500 transition-colors">Molecular Biology</Link></li>
              <li><Link to="/courses?subject=English" className="hover:text-brand-500 transition-colors">Academic English</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/tutor" className="hover:text-brand-500 transition-colors">24/7 AI Tutor Assistant</Link></li>
              <li><Link to="/quizzes" className="hover:text-brand-500 transition-colors">Dynamic AI Quiz Arena</Link></li>
              <li><Link to="/flashcards" className="hover:text-brand-500 transition-colors">Spaced Repetition Flashcards</Link></li>
              <li><Link to="/documents" className="hover:text-brand-500 transition-colors">Textbook & Slide Summarizer</Link></li>
              <li><Link to="/planner" className="hover:text-brand-500 transition-colors">Automated Study Schedules</Link></li>
              <li><Link to="/leaderboard" className="hover:text-brand-500 transition-colors">Student Competitions & XP</Link></li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform & Accounts
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/login" className="hover:text-brand-500 transition-colors">Student Portal Login</Link></li>
              <li><Link to="/login" className="hover:text-brand-500 transition-colors">Faculty / Teacher Portal</Link></li>
              <li><Link to="/login" className="hover:text-brand-500 transition-colors">Institution Admin Gateway</Link></li>
              <li><Link to="/register" className="hover:text-brand-500 transition-colors">Create Free Account</Link></li>
              <li className="pt-2 text-slate-400 text-[11px]">
                Supported: English, O'zbek, Русский
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} EduAI Inc. {t('allRightsReserved')}</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>{t('builtWithPride')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
