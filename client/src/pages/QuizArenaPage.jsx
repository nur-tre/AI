import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Sparkles, 
  Clock, 
  Award, 
  Play, 
  History, 
  Plus, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  X
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function QuizArenaPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [subject, setSubject] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [loading, setLoading] = useState(true);

  // AI Quiz Generator modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [genSubject, setGenSubject] = useState('Programming');
  const [genTopic, setGenTopic] = useState('');
  const [genDifficulty, setGenDifficulty] = useState('Intermediate');
  const [genCount, setGenCount] = useState(4);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, [subject, difficulty]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (subject !== 'All') params.subject = subject;
      if (difficulty !== 'All') params.difficulty = difficulty;

      const [qRes, hRes] = await Promise.all([
        api.get('/quizzes', { params }),
        api.get('/quizzes/history/my').catch(() => ({ data: { history: [] } }))
      ]);

      setQuizzes(qRes.data.quizzes || []);
      setHistory(hRes.data.history || []);
    } catch (err) {
      console.warn('Failed to load quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiQuiz = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const res = await api.post('/quizzes/generate', {
        subject: genSubject,
        topic: genTopic || `${genSubject} Core Principles`,
        difficulty: genDifficulty,
        questionCount: genCount,
        language: lang
      });

      setModalOpen(false);
      // Immediately navigate to take the newly generated AI quiz!
      navigate(`/quizzes/${res.data.quiz.id}`);
    } catch (err) {
      console.warn('Quiz generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Assessment Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('quizArenaTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('quizArenaSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('generateAiQuiz')}</span>
        </button>
      </div>

      {/* Quizzes List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Available Diagnostic Quizzes
          </h2>

          <div className="flex gap-2">
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Subjects</option>
              <option value="Programming">Programming</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>

            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
                    {quiz.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {quiz.title}
                </h3>

                <div className="flex items-center space-x-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{quiz.timeLimitMinutes} {t('minutes')}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{quiz.questionsCount} {t('questions')}</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  +{quiz.xpReward || 100} XP
                </span>
                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm shadow-brand-500/25 transition-all"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{t('startQuiz')}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz History Roster */}
      {history.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('quizHistoryTitle')}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5">Quiz Title</th>
                  <th className="py-2.5">Subject</th>
                  <th className="py-2.5">Score</th>
                  <th className="py-2.5">Result</th>
                  <th className="py-2.5">XP Earned</th>
                  <th className="py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/40">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{h.quizTitle}</td>
                    <td className="py-3">{h.subject}</td>
                    <td className="py-3 font-bold">{h.score}% ({h.correctCount}/{h.totalQuestions})</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        h.passed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                      }`}>
                        {h.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{h.passed ? 'Passed' : 'Failed'}</span>
                      </span>
                    </td>
                    <td className="py-3 font-bold text-purple-600 dark:text-purple-400">+{h.earnedXp} XP</td>
                    <td className="py-3 text-slate-400">{new Date(h.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Quiz Generator Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generate Custom AI Assessment
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Subject
                </label>
                <select
                  value={genSubject}
                  onChange={e => setGenSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Programming">Programming</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Topic / Focus Area (Optional)
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={e => setGenTopic(e.target.value)}
                  placeholder="e.g. Asynchronous JavaScript, Cellular Mitosis, Gradient Descent..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={genDifficulty}
                    onChange={e => setGenDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Question Count
                  </label>
                  <select
                    value={genCount}
                    onChange={e => setGenCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="3">3 Questions (Quick)</option>
                    <option value="4">4 Questions (Standard)</option>
                    <option value="5">5 Questions (Deep)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generating ? 'Synthesizing Questions with AI...' : 'Generate & Start Quiz'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
