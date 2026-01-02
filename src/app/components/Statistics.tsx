import { Activity, DailyLog, Penalty, Badge, Goal } from '../types';
import { ArrowLeft, Flame, Trophy, Clock, TrendingUp, Calendar, AlertTriangle, Target, CheckCircle2, XCircle, Award, Plus } from 'lucide-react';
import { calculateStats, getCategoryColor, getCategoryLabel } from '../utils/statsUtils';
import { getDateRange, getTodayDate, formatDate } from '../utils/dateUtils';
import { calculatePenalties, isActivityScheduledForDate, getActivePenalties } from '../utils/penaltyUtils';
import { useState } from 'react';
import { getBadgeDefinition } from '../utils/badgeUtils';
import { predictMonthlyCompletion, getActiveGoal } from '../utils/goalUtils';

interface StatisticsProps {
  activities: Activity[];
  logs: DailyLog[];
  badges: Badge[];
  goals: Goal[];
  onNavigate: (view: 'dashboard' | 'activities' | 'stats' | 'calendar' | 'settings') => void;
  onCreateGoal: () => void;
}

export function Statistics({ activities, logs, badges, goals, onNavigate, onCreateGoal }: StatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30>(7);
  const stats = calculateStats(activities, logs);
  const today = getTodayDate();
  const penalties = calculatePenalties(activities, logs, today);

  // Activity-specific stats
  const activityStats = activities.map(activity => {
    const activityLogs = logs.filter(log => log.activityId === activity.id && log.completed);
    const totalScheduled = logs.filter(log => log.activityId === activity.id).length;
    const completionRate = totalScheduled > 0 ? Math.round((activityLogs.length / totalScheduled) * 100) : 0;
    const activePenalties = getActivePenalties(penalties, activity.id, today);

    return {
      activity,
      completedCount: activityLogs.length,
      completionRate,
      hasPenalty: activePenalties.length > 0,
      penaltyValue: activePenalties.reduce((sum, p) => sum + p.increaseValue, 0),
    };
  });

  const last7Days = getDateRange(selectedPeriod);

  // Calculate completion for selected period
  const periodData = last7Days.map(date => {
    const scheduledActivities = activities.filter(a => isActivityScheduledForDate(a, date));
    const dayLogs = logs.filter(log => log.date === date);
    const completed = dayLogs.filter(log => log.completed).length;
    const total = scheduledActivities.length;
    return {
      date,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
      day: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
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
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
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
            {periodData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end h-24">
                  <div
                    className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-500"
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

        {/* Activity Details */}
        {activityStats.length > 0 && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="font-semibold">Détails par activité</h3>
            </div>
            <div className="space-y-4">
              {activityStats.map(({ activity, completedCount, completionRate, hasPenalty, penaltyValue }) => (
                <div key={activity.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: activity.color }}
                      />
                      <div>
                        <h4 className="font-semibold text-white">{activity.name}</h4>
                        <p className="text-xs text-gray-400">
                          {activity.value} {activity.unit} • {getCategoryLabel(activity.category)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{completionRate}%</p>
                      <p className="text-xs text-gray-400">{completedCount} complétées</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>

                  {/* Penalty indicator */}
                  {hasPenalty && (
                    <div className="flex items-center gap-2 mt-2 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        Pénalité active: +{penaltyValue} {activity.unit}
                      </span>
                    </div>
                  )}

                  {/* Week schedule */}
                  {activity.weekDays && activity.weekDays.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-400">
                        Planifiée {activity.weekDays.length} jours/semaine
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Penalties Section */}
        {penalties.length > 0 && (
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="font-semibold text-red-400">Pénalités actives</h3>
            </div>
            <div className="space-y-3">
              {penalties.map((penalty, index) => {
                const activity = activities.find(a => a.id === penalty.activityId);
                if (!activity) return null;

                const daysRemaining = Math.ceil(
                  (new Date(penalty.endDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={index} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: activity.color }}
                        />
                        <h4 className="font-semibold text-white">{activity.name}</h4>
                      </div>
                      <span className="text-xs text-red-400 font-semibold">
                        +{penalty.increaseValue} {activity.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        <span>Manquée le {formatDate(penalty.missedDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-red-400 font-semibold">
                          {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              💪 Complète ces activités pour supprimer les pénalités !
            </p>
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

        {/* Badges Section */}
        {badges.length > 0 && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-400" />
              <h3 className="font-semibold">Badges obtenus</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map(badge => {
                const definition = getBadgeDefinition(badge.type);
                if (!definition) return null;

                return (
                  <div key={badge.id} className={`p-4 rounded-xl bg-gradient-to-br ${definition.color} border border-white/20 text-center`}>
                    <div className="text-3xl mb-2">{definition.icon}</div>
                    <h4 className="font-semibold text-white text-sm mb-1">{definition.name}</h4>
                    <p className="text-xs text-white/70">{definition.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prediction Section */}
        {predictMonthlyCompletion(activities, logs) > 0 && (
          <div className="p-6 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/10 border border-violet-500/30">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-violet-400" />
              <h3 className="font-semibold">Prédiction du mois</h3>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-white mb-2">
                {predictMonthlyCompletion(activities, logs)}%
              </p>
              <p className="text-sm text-gray-300">
                Si tu continues au même rythme, tu termineras le mois à ce pourcentage
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}