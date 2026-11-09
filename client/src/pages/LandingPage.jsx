import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  Bot, 
  CheckSquare, 
  FileText, 
  Layers, 
  Calendar, 
  Trophy, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Star, 
  Users, 
  BrainCircuit, 
  ChevronRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Interactive AI Tutor Preview state
  const [previewInput, setPreviewInput] = useState('');
  const [previewChat, setPreviewChat] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am your EduAI Tutor. I can explain any concept step-by-step, generate instant practice quizzes, or simplify tough formulas. What would you like to explore today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handlePreviewSend = (e) => {
    e?.preventDefault();
    if (!previewInput.trim()) return;

    const query = previewInput.trim();
    setPreviewChat(prev => [...prev, { sender: 'user', text: query }]);
    setPreviewInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (lang === 'uz') {
        reply = `**Ajoyib savol!** "${query}" mavzusi bo'yicha tushuntirish:\n\n1. **Asosiy qoida:** Har qanday tizimda muvozanat va determinizm asosiy o'rinda turadi.\n2. **Amaliy qo'llanilishi:** Bu usul real hayotda murakkab muammolarni kichik bosqichlarga bo'lib hal qilish imkonini beradi.\n3. **Sinov savoli:** Ushbu qoidani o'z loyihangizda qanday qo'llagan bo'lar edingiz?`;
      } else if (lang === 'ru') {
        reply = `**Отличный вопрос!** Разбор по теме "${query}":\n\n1. **Ключевой принцип:** Разложение сложной проблемы на детерминированные элементарные подзадачи.\n2. **Практический пример:** В реальной разработке и науке это обеспечивает 100% воспроизводимость.\n3. **Вопрос на самопроверку:** Какие граничные условия здесь необходимо учесть?`;
      } else {
        reply = `**Brilliant question!** Here is a step-by-step breakdown of "${query}":\n\n1. **Foundational Concept:** Decomposing high-dimensional complexity into intuitive, verified primitives.\n2. **Practical Analog:** Think of it like compiling code—each token is validated before building the final executable.\n3. **Quick Check:** What would happen if the input values were scaled by a factor of 10?`;
      }

      setPreviewChat(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 900);
  };

  const subjects = [
    { name: 'Programming', icon: '💻', count: '4 Courses', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' },
    { name: 'Mathematics', icon: '📐', count: '3 Courses', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400' },
    { name: 'Physics', icon: '⚡', count: '3 Courses', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' },
    { name: 'Chemistry', icon: '🧪', count: '3 Courses', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' },
    { name: 'Biology', icon: '🧬', count: '3 Courses', color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400' },
    { name: 'History', icon: '🏛️', count: '3 Courses', color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' },
    { name: 'English', icon: '🌍', count: '3 Courses', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400' },
    { name: 'Geography', icon: '🗺️', count: '3 Courses', color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400' }
  ];

  const faqs = [
    {
      q: 'How does EduAI adapt to my specific learning speed?',
      a: 'EduAI continuously monitors your quiz scores, lesson completion times, and flashcard recall confidence. When you struggle on a concept, the AI Tutor automatically breaks it into smaller prerequisite steps.'
    },
    {
      q: 'Can teachers track their students and assign homework?',
      a: 'Yes! Teachers have a dedicated Teacher Hub to create courses, add video/text lessons, generate quizzes, and view a real-time completion roster for enrolled students.'
    },
    {
      q: 'Which languages are supported?',
      a: 'EduAI fully supports English, Uzbek (Oʻzbek tili), and Russian (Русский язык) across the whole UI, quizzes, and AI Tutor responses.'
    },
    {
      q: 'Can I upload my own PDF or lecture notes?',
      a: 'Yes! With our AI Document Summarizer, you can upload PDFs, Word documents, text notes, or lecture slides. EduAI extracts key formulas, provides executive summaries, and creates interactive flashcards.'
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 transition-colors">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-brand-500/15 via-purple-500/15 to-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {t('heroTitlePrefix')}{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('heroTitleHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t('heroSubtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
              >
                <span>{t('getStartedFree')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2"
              >
                <span>{t('exploreCourses')}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Live Platform Stats */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-navy-900/40 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">12,500+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('activeStudents')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-navy-900/40 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">98.4%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('satisfactionRate')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-navy-900/40 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">8</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('subjectsCovered')}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-navy-900/40 border border-slate-200/60 dark:border-slate-800">
                <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">45,000+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('quizzesGenerated')}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POPULAR SUBJECTS SECTION */}
      <section className="py-16 bg-white dark:bg-navy-900 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Core Academic Disciplines
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                From algorithmic programming to quantum physics and world history.
              </p>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 text-xs sm:text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>{t('exploreCourses')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map((s) => (
              <Link
                key={s.name}
                to={`/courses?subject=${s.name}`}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200/70 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-premium card-hover"
              >
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {s.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('featuresTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t('feature1Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('feature1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t('feature2Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('feature2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t('feature3Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('feature3Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t('feature4Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('feature4Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t('feature5Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('feature5Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover">
            <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-5">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {t('feature6Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('feature6Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* INTERACTIVE AI TUTOR LIVE PREVIEW */}
      <section className="py-16 bg-gradient-to-b from-brand-950 to-slate-950 text-white border-y border-brand-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-900/60 border border-brand-700/60 text-brand-300 text-xs font-semibold">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t('tutorPreviewTitle')}
            </h2>
            <p className="text-sm text-slate-300">
              {t('tutorPreviewSubtitle')}
            </p>
          </div>

          {/* Interactive Chat Box */}
          <div className="bg-navy-900/90 rounded-2xl border border-brand-800/80 shadow-2xl overflow-hidden flex flex-col h-[460px]">
            {/* Header */}
            <div className="px-5 py-3.5 bg-navy-800/80 border-b border-brand-800/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  EduAI Live Pedagogical Core
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Multilingual (EN / UZ / RU)
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {previewChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-navy-800 text-slate-200 border border-slate-700 rounded-bl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-navy-800 border border-slate-700 rounded-2xl p-3 text-xs text-brand-400 flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing pedagogical principles...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested prompt chips */}
            <div className="px-4 py-2 bg-navy-800/40 border-t border-brand-800/40 flex items-center space-x-2 overflow-x-auto text-xs">
              <span className="text-[11px] text-slate-400 flex-shrink-0">Try asking:</span>
              <button
                type="button"
                onClick={() => setPreviewInput(t('samplePrompt1'))}
                className="px-2.5 py-1 rounded-lg bg-navy-800 text-slate-300 hover:bg-brand-900/60 text-[11px] flex-shrink-0 transition-colors"
              >
                "{t('samplePrompt1')}"
              </button>
              <button
                type="button"
                onClick={() => setPreviewInput(t('samplePrompt2'))}
                className="px-2.5 py-1 rounded-lg bg-navy-800 text-slate-300 hover:bg-brand-900/60 text-[11px] flex-shrink-0 transition-colors"
              >
                "{t('samplePrompt2')}"
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={handlePreviewSend} className="p-3 bg-navy-800/90 border-t border-brand-800/60 flex items-center space-x-2">
              <input
                type="text"
                value={previewInput}
                onChange={e => setPreviewInput(e.target.value)}
                placeholder={t('askSomething')}
                className="flex-1 bg-navy-950/80 text-white placeholder-slate-400 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-brand-500 text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={!previewInput.trim() || isTyping}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A frictionless journey designed for maximum academic retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft text-center relative">
            <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4">1</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t('step1Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('step1Desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft text-center relative">
            <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4">2</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t('step2Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('step2Desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft text-center relative">
            <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4">3</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t('step3Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('step3Desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft text-center relative">
            <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4">4</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t('step4Title')}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t('step4Desc')}</p>
          </div>
        </div>
      </section>

      {/* TRANSPARENT PRICING */}
      <section className="py-20 bg-slate-100/60 dark:bg-navy-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('pricingTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t('pricingSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <div className="p-7 rounded-3xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 shadow-soft flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('planFreeTitle')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('planFreeDesc')}</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{t('planFreePrice')}</span>
                  <span className="text-xs text-slate-500 ml-1">{t('planFreePeriod')}</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Access to all standard courses</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>15 AI Tutor questions / day</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Interactive quizzes & scores</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Daily streak tracking</span></li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs text-center border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('choosePlan')}
              </Link>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="p-7 rounded-3xl bg-white dark:bg-navy-800 border-2 border-brand-500 shadow-premium flex flex-col justify-between relative transform lg:-translate-y-2">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-brand-600 text-white uppercase shadow-sm">
                {t('popularBadge')}
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('planProTitle')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('planProDesc')}</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">{t('planProPrice')}</span>
                  <span className="text-xs text-slate-500 ml-1">{t('planProPeriod')}</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /><span>Unlimited AI Tutor questions</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /><span>AI Dynamic Quiz Generator</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /><span>Full Document & Textbook Summarizer</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /><span>Spaced repetition deck exports</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-brand-500" /><span>Priority AI responses</span></li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs text-center bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/30 transition-all"
              >
                {t('choosePlan')}
              </Link>
            </div>

            {/* Campus Plan */}
            <div className="p-7 rounded-3xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-slate-700 shadow-soft flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('planCampusTitle')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('planCampusDesc')}</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{t('planCampusPrice')}</span>
                  <span className="text-xs text-slate-500 ml-1">{t('planCampusPeriod')}</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Faculty & Teacher Dashboards</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Student Progress Rosters & LMS Sync</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Custom Curriculum Authoring</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span>Dedicated account manager</span></li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 w-full py-2.5 rounded-xl font-bold text-xs text-center border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('choosePlan')}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t('testimonialsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center space-x-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed">
              "The AI Tutor explained calculus gradient descent better than my university professor. I went from barely passing to scoring in the top 5% of my computer science class."
            </p>
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Student"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Kamilla Tulyaganova</p>
                <p className="text-[11px] text-slate-500">CS Undergrad, Tashkent</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center space-x-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed">
              "Being able to ask questions in Uzbek and get structured, accurate explanations makes modern programming accessible to anyone without an English language barrier."
            </p>
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Student"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Azizbek Mirzaev</p>
                <p className="text-[11px] text-slate-500">Web Engineering Student</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
            <div className="flex items-center space-x-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed">
              "As a faculty lecturer, EduAI saves me 10+ hours a week. The automated quiz generation and student progress rosters give me complete visibility into where my students struggle."
            </p>
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Teacher"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. Svetlana Petrova</p>
                <p className="text-[11px] text-slate-500">Physics & Math Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white dark:bg-navy-900 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about the platform and AI algorithms.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-slate-50/60 dark:bg-navy-800/50 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="p-4 sm:p-5 bg-white dark:bg-navy-900 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Experience the Future of Learning?
          </h2>
          <p className="text-sm sm:text-base text-brand-100 max-w-2xl mx-auto">
            Join thousands of ambitious students mastering complex subjects with personalized AI guidance today.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-brand-700 hover:bg-brand-50 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition-all"
            >
              <span>{t('getStartedFree')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
