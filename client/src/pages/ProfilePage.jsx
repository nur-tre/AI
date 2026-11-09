import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Globe, 
  BookOpen, 
  Flame, 
  Clock, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [learningLevel, setLearningLevel] = useState(user?.learningLevel || 'intermediate');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setError('');

    try {
      setSaving(true);
      const res = await api.put('/auth/profile', {
        name,
        bio,
        learningLevel,
        preferredLanguage: lang
      });
      updateUser(res.data.user);
      setProfileMessage('Profile settings saved successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setPasswordMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email} • <span className="capitalize font-semibold text-brand-600 dark:text-brand-400">{user?.role}</span>
            </p>
            <div className="flex items-center space-x-3 pt-1 text-xs text-slate-500">
              <span className="flex items-center space-x-1 font-semibold text-orange-500">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{user?.streak || 1}d Streak</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 font-semibold text-purple-600 dark:text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user?.xp || 0} XP (Lvl {user?.level || 1})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Information Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Personal Information & Learning Preferences
            </h2>
          </div>
          {profileMessage && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{profileMessage}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('fullName')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('preferredLanguage')}
              </label>
              <select
                value={lang}
                onChange={e => changeLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="en">English (US)</option>
                <option value="uz">O'zbek tili</option>
                <option value="ru">Русский язык</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('learningLevelLabel')}
            </label>
            <select
              value={learningLevel}
              onChange={e => setLearningLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="beginner">Beginner / High School</option>
              <option value="intermediate">Intermediate / Undergraduate</option>
              <option value="advanced">Advanced / Professional</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Bio / Learning Objective
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : t('saveChanges')}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('changePassword')}
            </h2>
          </div>
          {passwordMessage && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{passwordMessage}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('currentPassword')}
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('newPassword')}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
}
