import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function QuizTakingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { updateUser } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
        setTimeLeft((res.data.timeLimitMinutes || 15) * 60);
      } catch (err) {
        console.warn('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (submitted || timeLeft <= 0 || !quiz) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted, quiz]);

  const selectAnswer = (questionId, value) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitQuiz = async () => {
    if (submitted || submitting) return;
    try {
      setSubmitting(true);
      const totalTime = (quiz?.timeLimitMinutes || 15) * 60;
      const timeSpent = Math.max(1, totalTime - timeLeft);

      const res = await api.post(`/quizzes/${id}/submit`, {
        answers,
        timeSpentSeconds: timeSpent
      });

      setResult(res.data);
      setSubmitted(true);

      if (res.data.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      updateUser({ xp: (u => (u?.xp || 0) + res.data.earnedXp) });
    } catch (err) {
      console.warn('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-sm">Preparing diagnostic quiz environment...</div>;
  }

  if (!quiz) {
    return <div className="py-20 text-center text-slate-400 text-sm">Quiz not found.</div>;
  }

  const questions = quiz.questions || [];
  const currentQ = questions[currentIndex];
  const formatTime = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  // If already submitted, display detailed review
  if (submitted && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg bg-gradient-to-tr from-brand-600 to-purple-600 text-white">
            {result.passed ? '🎉' : '📚'}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {result.passed ? t('passed') : t('failed')}
          </h2>

          <div className="inline-flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{result.score}%</span>
              <p className="text-[11px] text-slate-400">Score</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.correctCount} / {result.totalQuestions}
              </span>
              <p className="text-[11px] text-slate-400">Correct</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">+{result.earnedXp}</span>
              <p className="text-[11px] text-slate-400">XP Awarded</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
                setCurrentIndex(0);
                setTimeLeft((quiz.timeLimitMinutes || 15) * 60);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('retryQuiz')}</span>
            </button>
            <Link
              to="/quizzes"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-brand-500/20 transition-all"
            >
              <span>{t('backToQuizzes')}</span>
            </Link>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white px-1">
            Question-by-Question Review & Explanations
          </h3>

          {result.detailedResults?.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${
                item.isCorrect
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Q{idx + 1}. {item.question}
                </span>
                {item.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </div>

              <div className="text-xs space-y-1 mb-3">
                <p className="text-slate-600 dark:text-slate-400">
                  Your Answer: <strong className={item.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>{item.userAnswer}</strong>
                </p>
                {!item.isCorrect && (
                  <p className="text-slate-600 dark:text-slate-400">
                    Correct Answer: <strong className="text-emerald-600 dark:text-emerald-400">{item.correctAnswer}</strong>
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/80 dark:bg-navy-900/80 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
                <strong>Pedagogical Insight:</strong> {item.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Quiz Top Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {quiz.subject} • {quiz.difficulty}
          </span>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {quiz.title}
          </h1>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-800 font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
          <Clock className="w-4 h-4 text-brand-500" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Stepper Progress */}
      <div className="flex items-center space-x-1.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex-1 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-brand-600'
                : answers[q.id]
                ? 'bg-brand-200 dark:bg-brand-900'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
            title={`Question ${idx + 1}`}
          />
        ))}
      </div>

      {/* Active Question Card */}
      {currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('question')} {currentIndex + 1} {t('of')} {questions.length}</span>
            <span className="capitalize">{currentQ.type.replace('_', ' ')}</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Options Renderer */}
          {currentQ.type === 'multiple_choice' || currentQ.type === 'true_false' ? (
            <div className="space-y-3">
              {currentQ.options?.map((opt, oIdx) => {
                const selected = answers[currentQ.id] === opt;
                return (
                  <button
                    key={oIdx}
                    onClick={() => selectAnswer(currentQ.id, opt)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-navy-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                      selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Type your structured written explanation:
              </label>
              <textarea
                rows={4}
                value={answers[currentQ.id] || ''}
                onChange={e => selectAnswer(currentQ.id, e.target.value)}
                placeholder="Formulate your concise, precise answer here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('previous')}</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>{t('next')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 transition-all flex items-center space-x-1.5"
              >
                <span>{submitting ? 'Scoring...' : t('submitQuiz')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
