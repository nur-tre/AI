import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Settings form state
  const [settings, setSettings] = useState({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Add User Modal
  const [addUserModal, setAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Student123!');
  const [newUserRole, setNewUserRole] = useState('student');

  useEffect(() => {
    loadAdminData();
  }, [roleFilter, search]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;

      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users', { params })
      ]);

      setStats(statsRes.data);
      setSettings(statsRes.data.settings || {});
      setUsersList(usersRes.data.users || []);
    } catch (err) {
      console.warn('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === user?.id) {
      alert('You cannot delete your own admin account.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsersList(prev => prev.filter(u => u.id !== id));
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handlePromoteRole = async (uId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${uId}`, { role: newRole });
      setUsersList(prev => prev.map(u => (u.id === uId ? res.data.user : u)));
    } catch (err) {}
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole
      });
      setUsersList(prev => [res.data.user, ...prev]);
      setAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/admin/settings', settings);
      setSettings(res.data.settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      alert('Failed to update system settings.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <Shield className="w-4 h-4" />
            <span>EduAI Governance & Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('adminSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setAddUserModal(true)}
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addUser')}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-[11px] font-semibold text-slate-400">{t('totalUsers')}</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalUsers || 3}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-[11px] font-semibold text-slate-400">Students</span>
          <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
            {stats?.studentCount || 1}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-[11px] font-semibold text-slate-400">{t('totalTeachers')}</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.teacherCount || 1}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-[11px] font-semibold text-slate-400">{t('platformCourses')}</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {stats?.totalCourses || 8}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
          <span className="text-[11px] font-semibold text-slate-400">{t('avgPlatformScore')}</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {stats?.avgQuizScore || 84}%
          </p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('userManagement')}
            </h2>
            <p className="text-xs text-slate-400">Manage student, teacher, and administrator credentials</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search user..."
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-2.5">User</th>
                <th className="py-2.5">{t('role')}</th>
                <th className="py-2.5">XP & Level</th>
                <th className="py-2.5">Streak</th>
                <th className="py-2.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/40">
                  <td className="py-3 flex items-center space-x-3">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={e => handlePromoteRole(u.id, e.target.value)}
                      className="px-2 py-1 rounded-md text-[11px] font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 focus:outline-none capitalize"
                    >
                      <option value="student">student</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3 font-semibold">
                    {u.xp || 0} XP (Lvl {u.level || 1})
                  </td>
                  <td className="py-3 font-bold text-orange-500">
                    {u.streak || 1} days
                  </td>
                  <td className="py-3 text-right">
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Global Settings Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('platformSettings')}
            </h2>
          </div>
          {settingsSaved && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName || ''}
                onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Active AI Model
              </label>
              <input
                type="text"
                value={settings.aiModel || 'gemini-1.5-flash'}
                onChange={e => setSettings({ ...settings, aiModel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistration !== false}
                onChange={e => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>{t('allowReg')}</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode === true}
                onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>{t('maintenance')}</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
          >
            {t('saveSettings')}
          </button>
        </form>
      </div>

      {/* Add User Modal */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('addUser')}</h3>
              <button onClick={() => setAddUserModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={e => setNewUserPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('role')}</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
