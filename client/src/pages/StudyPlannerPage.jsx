import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  Trash2, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function StudyPlannerPage() {
  const { t } = useLanguage();
  const { updateUser } = useAuth();

  const [plans, setPlans] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Add Task Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Programming');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  // AI Schedule Generator Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [focusGoal, setFocusGoal] = useState('Prepare for Midterm Exams');
  const [dailyHours, setDailyHours] = useState(2);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/study-plans');
      setPlans(res.data.plans || []);
    } catch (err) {
      console.warn('Failed to load study plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await api.put(`/study-plans/${task.id}`, { status: newStatus });
      setPlans(prev => prev.map(p => (p.id === task.id ? res.data.plan : p)));

      if (newStatus === 'completed') {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 }
        });
        updateUser({ xp: (u => (u?.xp || 0) + 30) });
      }
    } catch (err) {}
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/study-plans/${id}`);
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {}
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post('/study-plans', {
        title,
        subject,
        dueDate,
        priority,
        estimatedMinutes
      });
      setPlans(prev => [...prev, res.data.plan]);
      setTitle('');
      setModalOpen(false);
    } catch (err) {}
  };

  const handleGenerateAiSchedule = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const res = await api.post('/study-plans/generate-ai', {
        targetExamOrGoal: focusGoal,
        availableHoursPerDay: dailyHours
      });
      setPlans(prev => [...prev, ...(res.data.tasks || [])]);
      setAiModalOpen(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.warn('AI schedule generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const filteredPlans = plans.filter(p => {
    if (filter === 'pending') return p.status !== 'completed';
    if (filter === 'completed') return p.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <CalendarIcon className="w-4 h-4" />
            <span>AI Automated Scheduling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Smart Study Planner & Goal Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Keep track of daily study goals, exam countdowns, and generate optimized learning schedules with AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Schedule</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-navy-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === f
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f} ({f === 'all' ? plans.length : plans.filter(p => (f === 'completed' ? p.status === 'completed' : p.status !== 'completed')).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredPlans.length > 0 ? (
          filteredPlans.map(task => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                  isDone
                    ? 'bg-slate-50/70 dark:bg-navy-800/40 border-slate-200/60 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 shadow-soft hover:border-brand-300 dark:hover:border-brand-800'
                }`}
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <button
                    onClick={() => toggleTask(task)}
                    className="p-1 text-slate-400 hover:text-brand-600 transition-colors flex-shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h3 className={`text-xs sm:text-sm font-bold truncate ${
                      isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{task.subject}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedMinutes} min</span>
                      </span>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    task.priority === 'high'
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                      : task.priority === 'medium'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-opacity"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center text-slate-400 text-xs sm:text-sm bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No tasks found in this view. Click "Add Study Task" or "Generate AI Schedule" to populate!
          </div>
        )}
      </div>

      {/* Add Custom Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Study Task</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Master Linear Transformations Lesson 2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={estimatedMinutes}
                    onChange={e => setEstimatedMinutes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Schedule Generator Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Study Schedule Generator</h3>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleGenerateAiSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Learning Target / Exam Goal</label>
                <input
                  type="text"
                  required
                  value={focusGoal}
                  onChange={e => setFocusGoal(e.target.value)}
                  placeholder="e.g. Master Full-Stack Web Dev in 4 weeks"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Available Hours per Day</label>
                <select
                  value={dailyHours}
                  onChange={e => setDailyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="1">1 hour / day (Light)</option>
                  <option value="2">2 hours / day (Standard)</option>
                  <option value="3">3 hours / day (Intensive)</option>
                  <option value="4">4+ hours / day (Full-time)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Synthesizing Schedule...' : 'Generate 5-Day Study Plan'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
