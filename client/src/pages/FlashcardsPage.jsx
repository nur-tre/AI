import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Star, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function FlashcardsPage() {
  const { t } = useLanguage();
  const { updateUser } = useAuth();

  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Deck Modal
  const [newDeckModal, setNewDeckModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('Programming');

  // AI Flashcards Generator Modal
  const [aiGenModal, setAiGenModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/flashcards/decks');
      setDecks(res.data.decks || []);
    } catch (err) {
      console.warn('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  };

  const startStudyingDeck = async (deck) => {
    try {
      const res = await api.get(`/flashcards/decks/${deck.id}`);
      setActiveDeck(res.data.deck);
      setCards(res.data.cards || []);
      setCurrentIndex(0);
      setFlipped(false);
    } catch (err) {}
  };

  const handleCardRating = (rating) => {
    if (rating === 'easy') {
      updateUser({ xp: (u => (u?.xp || 0) + 20) });
    }
    if (currentIndex < cards.length - 1) {
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;
    try {
      const res = await api.post('/flashcards/decks', {
        title: newDeckTitle,
        subject: newDeckSubject
      });
      setDecks(prev => [...prev, { ...res.data.deck, cardCount: 0 }]);
      setNewDeckModal(false);
      setNewDeckTitle('');
    } catch (err) {}
  };

  const handleGenerateAiCards = async (e) => {
    e.preventDefault();
    if (!activeDeck) return;
    try {
      setGenerating(true);
      const res = await api.post(`/flashcards/decks/${activeDeck.id}/generate-ai`, {
        topic: aiTopic || activeDeck.title,
        count: 5
      });
      setCards(prev => [...prev, ...(res.data.cards || [])]);
      setAiGenModal(false);
      setAiTopic('');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch (err) {
      console.warn('AI card generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  // Study Mode View
  if (activeDeck) {
    const currentCard = cards[currentIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveDeck(null)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Decks</span>
          </button>

          <button
            onClick={() => setAiGenModal(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold flex items-center space-x-1.5 hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate More Cards with AI</span>
          </button>
        </div>

        {/* Deck Title & Stepper */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {activeDeck.subject}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {activeDeck.title}
          </h2>
          <p className="text-xs text-slate-400">
            Card {currentIndex + 1} of {cards.length || 1}
          </p>
        </div>

        {/* Interactive 3D Flip Card */}
        {currentCard ? (
          <div
            onClick={() => setFlipped(!flipped)}
            className="relative h-80 rounded-3xl cursor-pointer select-none perspective-1000 shadow-2xl transition-transform hover:scale-[1.01]"
          >
            <div
              className={`w-full h-full rounded-3xl p-8 flex flex-col justify-between border transition-all duration-500 ${
                flipped
                  ? 'bg-gradient-to-br from-brand-900 via-navy-900 to-purple-950 text-white border-brand-700'
                  : 'bg-white dark:bg-navy-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {flipped ? 'Answer / Pedagogical Key' : 'Prompt / Question'}
                </span>
                <span className="text-brand-500 text-xs font-semibold flex items-center space-x-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click to Flip</span>
                </span>
              </div>

              <div className="text-center py-6">
                <p className="text-base sm:text-lg font-bold leading-relaxed whitespace-pre-line">
                  {flipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                Spaced Repetition Active Recall Card
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 text-xs bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No cards in this deck yet. Click "Generate More Cards with AI" to populate!
          </div>
        )}

        {/* Rating & Navigation Controls */}
        {currentCard && (
          <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setFlipped(false);
                  setCurrentIndex(currentIndex - 1);
                }
              }}
              disabled={currentIndex === 0}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCardRating('hard')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 hover:bg-red-100 transition-colors"
              >
                Hard
              </button>
              <button
                onClick={() => handleCardRating('medium')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 hover:bg-amber-100 transition-colors"
              >
                Medium
              </button>
              <button
                onClick={() => handleCardRating('easy')}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Easy (+20 XP)
              </button>
            </div>

            <button
              onClick={() => {
                if (currentIndex < cards.length - 1) {
                  setFlipped(false);
                  setCurrentIndex(currentIndex + 1);
                }
              }}
              disabled={currentIndex >= cards.length - 1}
              className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* AI Cards Generator Modal */}
        {aiGenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Generate Flashcards with AI</h3>
                </div>
                <button onClick={() => setAiGenModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleGenerateAiCards} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic or Concept Prompt</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder={`e.g. ${activeDeck.title} fundamental formulas`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generating ? 'Synthesizing Flashcards...' : 'Add 5 AI Flashcards'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // Decks List View
  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Layers className="w-4 h-4" />
            <span>Active Recall System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('flashcardsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('flashcardsSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setNewDeckModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createDeck')}</span>
        </button>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft card-hover flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
                {deck.subject}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {deck.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {deck.description || 'Master key terms, axioms, and exam formulas with scientific active recall.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                {deck.cardCount} {t('cardsCount')}
              </span>
              <button
                onClick={() => startStudyingDeck(deck)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
              >
                <span>{t('studyDeck')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Deck Modal */}
      {newDeckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('createDeck')}</h3>
              <button onClick={() => setNewDeckModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateDeck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deck Title</label>
                <input
                  type="text"
                  required
                  value={newDeckTitle}
                  onChange={e => setNewDeckTitle(e.target.value)}
                  placeholder="e.g. Organic Chemistry Functional Groups"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={newDeckSubject}
                  onChange={e => setNewDeckSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Programming">Programming</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Create Deck
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
