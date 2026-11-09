import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award, 
  Crown, 
  Medal, 
  Rocket, 
  Layers, 
  Bot, 
  Compass, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function GamificationPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGamification() {
      try {
        setLoading(true);
        const [statsRes, lbRes] = await Promise.all([
          api.get('/gamification/stats'),
          api.get('/gamification/leaderboard')
        ]);
        setStats(statsRes.data);
        setLeaderboard(lbRes.data.leaderboard || []);
      } catch (err) {
        console.warn('Failed to load gamification data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGamification();
  }, []);

  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Rocket': return <Rocket className="w-5 h-5 text-blue-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-500" />;
      case 'Bot': return <Bot className="w-5 h-5 text-emerald-500" />;
      case 'Compass': return <Compass className="w-5 h-5 text-pink-500" />;
      default: return <Award className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            <Trophy className="w-4 h-4" />
            <span>Academic Gamification Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('gamificationTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('gamificationSubtitle')}
          </p>
        </div>

        {/* Level Progression Bar */}
        {stats && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-indigo-50 to-purple-50 dark:from-navy-800 dark:to-slate-900 border border-brand-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-brand-700 dark:text-brand-300">
                Level {stats.level} Scholar
              </span>
              <span className="text-slate-500">
                {stats.xp} / {stats.xpForNextLevel} XP ({stats.levelProgress}% progress)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.levelProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Global Leaderboard */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('globalLeaderboard')}
              </h2>
            </div>
            <span className="text-xs text-slate-400">Updated hourly</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaderboard.map((student) => {
              const isTop1 = student.rank === 1;
              const isTop2 = student.rank === 2;
              const isTop3 = student.rank === 3;
              const isCurrentUser = student.id === user?.id;

              return (
                <div
                  key={student.id}
                  className={`py-3.5 px-3 rounded-2xl flex items-center justify-between transition-colors ${
                    isCurrentUser
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 ring-1 ring-brand-500/20'
                      : 'hover:bg-slate-50 dark:hover:bg-navy-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-7 text-center font-bold text-xs flex-shrink-0">
                      {isTop1 ? (
                        <span className="text-lg">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-lg">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-lg">🥉</span>
                      ) : (
                        <span className="text-slate-400">#{student.rank}</span>
                      )}
                    </div>

                    <img
                      src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                      alt={student.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate flex items-center space-x-1.5">
                        <span>{student.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-600 text-white font-bold">You</span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Level {student.level} • {student.streak}d streak
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-brand-600 dark:text-brand-400">
                      {student.xp} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Gallery */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center space-x-2">
            <Medal className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('allBadges')}
            </h2>
          </div>

          <div className="space-y-3">
            {stats?.achievements?.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
                  ach.unlocked
                    ? 'bg-white dark:bg-navy-800 border-slate-200 dark:border-slate-700 shadow-xs'
                    : 'bg-slate-50 dark:bg-navy-950/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  ach.unlocked ? 'bg-amber-50 dark:bg-amber-950/60' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  {ach.unlocked ? getBadgeIcon(ach.icon) : <Lock className="w-4 h-4 text-slate-400" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {ach.description}
                  </p>
                  {ach.unlocked && (
                    <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
