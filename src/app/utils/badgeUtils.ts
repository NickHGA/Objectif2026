import { Badge, Activity, DailyLog } from '../types';
import { calculateStats } from './statsUtils';

export interface BadgeDefinition {
  type: Badge['type'];
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    type: 'streak_7',
    name: '7 jours de feu',
    description: 'Maintiens ta discipline pendant 7 jours consécutifs',
    icon: '🔥',
    color: 'from-orange-500 to-red-500',
  },
  {
    type: 'streak_30',
    name: 'Champion du mois',
    description: '30 jours de discipline sans interruption',
    icon: '👑',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    type: 'streak_100',
    name: 'Légende vivante',
    description: '100 jours consécutifs - Incroyable !',
    icon: '🏆',
    color: 'from-purple-500 to-pink-500',
  },
  {
    type: 'perfect_week',
    name: 'Semaine parfaite',
    description: '100% de complétion sur une semaine',
    icon: '⭐',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'perfect_month',
    name: 'Mois parfait',
    description: '100% de complétion pendant un mois entier',
    icon: '💎',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    type: 'activities_100',
    name: 'Centurion',
    description: 'Complète 100 activités au total',
    icon: '💯',
    color: 'from-green-500 to-emerald-500',
  },
  {
    type: 'activities_500',
    name: 'Titan',
    description: '500 activités complétées - Impressionnant !',
    icon: '🚀',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    type: 'early_bird',
    name: 'Lève-tôt',
    description: 'Complète une activité avant 7h du matin',
    icon: '🌅',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    type: 'night_owl',
    name: 'Oiseau de nuit',
    description: 'Complète une activité après 23h',
    icon: '🦉',
    color: 'from-slate-500 to-gray-500',
  },
];

export const checkNewBadges = (
  activities: Activity[],
  logs: DailyLog[],
  currentBadges: Badge[]
): Badge[] => {
  const newBadges: Badge[] = [];
  const stats = calculateStats(activities, logs);
  const earnedTypes = new Set(currentBadges.map(b => b.type));

  // Streak badges
  if (stats.currentStreak >= 7 && !earnedTypes.has('streak_7')) {
    newBadges.push({
      id: crypto.randomUUID(),
      type: 'streak_7',
      earnedAt: new Date().toISOString(),
    });
  }
  if (stats.currentStreak >= 30 && !earnedTypes.has('streak_30')) {
    newBadges.push({
      id: crypto.randomUUID(),
      type: 'streak_30',
      earnedAt: new Date().toISOString(),
    });
  }
  if (stats.currentStreak >= 100 && !earnedTypes.has('streak_100')) {
    newBadges.push({
      id: crypto.randomUUID(),
      type: 'streak_100',
      earnedAt: new Date().toISOString(),
    });
  }

  // Activity count badges
  const totalCompleted = logs.filter(l => l.completed).length;
  if (totalCompleted >= 100 && !earnedTypes.has('activities_100')) {
    newBadges.push({
      id: crypto.randomUUID(),
      type: 'activities_100',
      earnedAt: new Date().toISOString(),
    });
  }
  if (totalCompleted >= 500 && !earnedTypes.has('activities_500')) {
    newBadges.push({
      id: crypto.randomUUID(),
      type: 'activities_500',
      earnedAt: new Date().toISOString(),
    });
  }

  // Time-based badges
  const completedLogs = logs.filter(l => l.completed && l.completedAt);
  
  if (!earnedTypes.has('early_bird')) {
    const hasEarlyCompletion = completedLogs.some(log => {
      if (!log.completedAt) return false;
      const hour = new Date(log.completedAt).getHours();
      return hour < 7;
    });
    if (hasEarlyCompletion) {
      newBadges.push({
        id: crypto.randomUUID(),
        type: 'early_bird',
        earnedAt: new Date().toISOString(),
      });
    }
  }

  if (!earnedTypes.has('night_owl')) {
    const hasNightCompletion = completedLogs.some(log => {
      if (!log.completedAt) return false;
      const hour = new Date(log.completedAt).getHours();
      return hour >= 23;
    });
    if (hasNightCompletion) {
      newBadges.push({
        id: crypto.randomUUID(),
        type: 'night_owl',
        earnedAt: new Date().toISOString(),
      });
    }
  }

  return newBadges;
};

export const getBadgeDefinition = (type: Badge['type']): BadgeDefinition | undefined => {
  return BADGE_DEFINITIONS.find(b => b.type === type);
};
