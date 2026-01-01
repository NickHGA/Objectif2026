import { Activity, DailyLog } from '../types';
import { ArrowLeft, Flame, Trophy, Clock, TrendingUp, Calendar } from 'lucide-react';
import { calculateStats, getCategoryColor, getCategoryLabel } from '../utils/statsUtils';
import { getDateRange } from '../utils/dateUtils';

interface StatisticsProps {
  activities: Activity[];
  logs: DailyLog[];
  onNavigate: (view: 'dashboard' | 'activities' | 'stats') => void;
}

export function Statistics({ activities, logs, onNavigate }: StatisticsProps) {
  const stats = calculateStats(activities, logs);
  const last7Days = getDateRange(7);
  
  // Calculate completion for last 7 days
  const weekData = last7Days.map(date => {
    const dayLogs = logs.filter(log => log.date === date);
    const completed = dayLogs.filter(log => log.completed).length;
    const total = activities.length;
    return {
      date,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      day: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    };
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Statistiques</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Main stats cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <h3 className="text-sm text-gray-400">Série actuelle</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
            <p className="text-xs text-gray-500 mt-1">jours consécutifs</p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-sm text-gray-400">Record</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.longestStreak}</p>
            <p className="text-xs text-gray-500 mt-1">meilleure série</p>
          </div>
        </div>

        {/* Today's progress */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold">Aujourd'hui</h3>
            </div>
            <span className="text-2xl font-bold text-white">{stats.completionRate}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {stats.completedToday} / {stats.totalActivities} activités complétées
          </p>
        </div>

        {/* Weekly chart */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-violet-400" />
            <h3 className="font-semibold">7 derniers jours</h3>
          </div>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {weekData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-24">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-violet-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${day.rate}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time spent */}
        {stats.totalTimeSpent > 0 && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold">Temps total investi</h3>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {Math.floor(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}min
            </p>
            <p className="text-sm text-gray-400">
              Depuis le début de ton parcours
            </p>
          </div>
        )}

        {/* Category breakdown */}
        {Object.values(stats.categoryBreakdown).some(v => v > 0) && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-4">Par catégorie</h3>
            <div className="space-y-3">
              {(Object.entries(stats.categoryBreakdown) as [any, number][])
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => (
                  <div key={category} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    />
                    <span className="flex-1 text-sm text-gray-300">
                      {getCategoryLabel(category)}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {count} fois
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Motivational message */}
        {stats.currentStreak >= 7 && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 text-center">
            <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">
              Incroyable ! 🎉
            </h3>
            <p className="text-sm text-gray-300">
              Tu as maintenu ta discipline pendant {stats.currentStreak} jours d'affilée.
              Continue comme ça !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
