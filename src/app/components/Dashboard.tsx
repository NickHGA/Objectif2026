import { Activity, DailyLog, Penalty } from '../types';
import { ActivityCard } from './ActivityCard';
import { getTodayDate, formatDate } from '../utils/dateUtils';
import { Calendar, TrendingUp, Plus } from 'lucide-react';
import { isActivityScheduledForDate, calculatePenalties } from '../utils/penaltyUtils';

interface DashboardProps {
  activities: Activity[];
  logs: DailyLog[];
  onToggleActivity: (activityId: string, value?: number, comment?: string) => void;
  onNavigate: (view: 'dashboard' | 'activities' | 'stats') => void;
}

export function Dashboard({ activities, logs, onToggleActivity, onNavigate }: DashboardProps) {
  const today = getTodayDate();
  const todayLogs = logs.filter(log => log.date === today);
  
  // Filter activities for today based on weekDays
  const todayActivities = activities.filter(activity => 
    isActivityScheduledForDate(activity, today)
  );
  
  // Calculate penalties
  const penalties = calculatePenalties(activities, logs, today);
  
  const completedCount = todayLogs.filter(log => log.completed).length;
  const totalCount = todayActivities.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black to-transparent backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Objectif 2026</h1>
              <p className="text-sm text-gray-400">{formatDate(today)}</p>
            </div>
            <button
              onClick={() => onNavigate('stats')}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progression du jour</span>
              <span className="font-semibold text-white">{completedCount}/{totalCount}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-500">{completionRate}% complété</p>
          </div>
        </div>
      </div>

      {/* Activities list */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {todayActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {activities.length === 0 ? 'Aucune activité' : 'Aucune activité prévue aujourd\'hui'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activities.length === 0 
                ? 'Commence par créer ta première activité' 
                : 'Profite de ce jour de repos !'}
            </p>
            {activities.length === 0 && (
              <button
                onClick={() => onNavigate('activities')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Créer une activité
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {todayActivities.map(activity => {
              const log = todayLogs.find(l => l.activityId === activity.id);
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  log={log}
                  penalties={penalties}
                  currentDate={today}
                  onToggle={onToggleActivity}
                />
              );
            })}
          </div>
        )}

        {/* Add activity button */}
        {activities.length > 0 && (
          <button
            onClick={() => onNavigate('activities')}
            className="w-full mt-6 py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:border-white/20 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Gérer les activités
          </button>
        )}
      </div>
    </div>
  );
}