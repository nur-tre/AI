import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Trash2, 
  Plus, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  ChevronDown,
  Layers,
  MessageSquare
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AITutorPage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [aiStatus, setAiStatus] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('Programming');
  const [learningLevel, setLearningLevel] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check AI backend status
    api.get('/ai/status').then(res => setAiStatus(res.data)).catch(() => {});
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const res = await api.get('/ai/conversations');
      const list = res.data.conversations || [];
      setConversations(list);
      if (list.length > 0 && !currentConversationId) {
        selectConversation(list[0].id);
      } else if (list.length === 0) {
        startNewConversation();
      }
    } catch (err) {}
  };

  const selectConversation = async (id) => {
    try {
      setCurrentConversationId(id);
      const res = await api.get(`/ai/conversations/${id}`);
      setMessages(res.data.conversation.messages || []);
      if (res.data.conversation.subject) {
        setSubject(res.data.conversation.subject);
      }
    } catch (err) {}
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        id: 'init_msg',
        sender: 'assistant',
        text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I am your EduAI Personal Tutor. How can I assist your study session in **${subject}** today? Ask for step-by-step proofs, code walkthroughs, or simplified analogies!`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const deleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/conversations/${id}`);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversationId === id) {
        startNewConversation();
      }
    } catch (err) {}
  };

  const sendMessage = async (promptText) => {
    const textToSend = (promptText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        prompt: textToSend,
        subject,
        conversationId: currentConversationId,
        language: lang,
        learningLevel
      });

      if (!currentConversationId && res.data.conversationId) {
        setCurrentConversationId(res.data.conversationId);
        loadConversations();
      }

      setMessages(prev => [...prev, res.data.message]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: '⚠️ An error occurred while communicating with the AI service. Please check your backend connection.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.text);
    }
  };

  const quickAction = (type) => {
    if (type === 'step') {
      sendMessage(`Explain the core principles of ${subject} step-by-step with mathematical or logical proofs.`);
    } else if (type === 'simple') {
      sendMessage(`Explain ${subject} like I am 12 years old using an intuitive real-world analogy.`);
    } else if (type === 'example') {
      sendMessage(`Give me a production-ready practical example or case study in ${subject}.`);
    } else if (type === 'practice') {
      sendMessage(`Generate 1 tricky diagnostic practice problem for ${subject} with a hidden solution.`);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-4">
      
      {/* Conversations Drawer Sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shadow-soft">
        <div>
          <button
            onClick={startNewConversation}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm shadow-brand-500/25 transition-all mb-4"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newChat')}</span>
          </button>

          {/* Subject & Level Selectors */}
          <div className="space-y-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('selectSubject')}
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {t('selectLevel')}
              </label>
              <select
                value={learningLevel}
                onChange={e => setLearningLevel(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 px-1">
            {t('chatHistory')}
          </p>

          <div className="max-h-64 lg:max-h-80 overflow-y-auto space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  currentConversationId === conv.id
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  title="Delete thread"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Key Status Notice */}
        {aiStatus && !aiStatus.configured && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-700 dark:text-amber-300">
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Setup Notice</span>
            </div>
            <p className="leading-relaxed">
              Real API key not configured in `server/.env`. Running on local EduAI Pedagogical Core.
            </p>
          </div>
        )}
      </div>

      {/* Main Conversation Stage */}
      <div className="flex-1 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{t('tutorHeading')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 font-bold uppercase">
                  {subject}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Responding in {lang.toUpperCase()} • Level: {learningLevel}
              </p>
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={t('regenerate')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-navy-800/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => quickAction('step')}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors flex-shrink-0"
          >
            🔍 {t('stepByStep')}
          </button>
          <button
            onClick={() => quickAction('simple')}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors flex-shrink-0"
          >
            🧒 {t('simplify')}
          </button>
          <button
            onClick={() => quickAction('example')}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors flex-shrink-0"
          >
            💡 {t('giveExample')}
          </button>
          <button
            onClick={() => quickAction('practice')}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors flex-shrink-0"
          >
            📝 {t('practiceQuestion')}
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none whitespace-pre-line'
                }`}
              >
                {msg.text}

                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>EduAI Tutor Core</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-brand-500 flex items-center space-x-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">{t('copied')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t('copyAnswer')}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 text-xs text-brand-600 dark:text-brand-400 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>EduAI Tutor is generating step-by-step pedagogical explanation...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-navy-900 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask anything about ${subject} (e.g. Explain how to compute gradients step by step)...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center shadow-md shadow-brand-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
