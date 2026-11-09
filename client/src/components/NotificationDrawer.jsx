import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, X, Sparkles, BookOpen, Clock } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationDrawer({ isOpen, onClose, onCountChange }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      if (onCountChange) onCountChange(res.data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      if (onCountChange) {
        onCountChange(prev => Math.max(0, prev - 1));
      }
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (onCountChange) onCountChange(0);
    } catch (err) {}
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-navy-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('notifications')}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllRead}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('markAllRead')}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.read && markAsRead(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                    item.read
                      ? 'bg-slate-50 dark:bg-navy-800/40 border-slate-200/60 dark:border-slate-800'
                      : 'bg-white dark:bg-navy-800 border-brand-200 dark:border-brand-900 shadow-xs ring-1 ring-brand-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-500 flex-shrink-0">
                        {item.type === 'achievement' ? (
                          <Sparkles className="w-4 h-4 text-amber-500" />
                        ) : item.type === 'course' ? (
                          <BookOpen className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                      }}
                      className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                {t('noNotifications')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
