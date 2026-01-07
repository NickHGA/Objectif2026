import { Badge, Activity, DailyLog, DailyNote, Goal, Category } from '../types';
import { calculateStats } from './statsUtils';
import { isActivityScheduledForDate, calculatePenalties } from './penaltyUtils';
import { getTodayDate, getDateRange } from './dateUtils';

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
  {
    type: 'polyvalent',
    name: 'Polyvalent',
    description: 'Valide au moins une activité dans chaque catégorie',
    icon: '🌈',
    color: 'from-pink-500 to-rose-500',
  },
  {
    type: 'guerrier_dimanche',
    name: 'Guerrier du Dimanche',
    description: 'Complète 100% de tes activités le weekend dernier',
    icon: '⚔️',
    color: 'from-red-600 to-orange-600',
  },
  {
    type: 'specialiste',
    name: 'Spécialiste',
    description: 'Atteins 30 validations dans une seule catégorie',
    icon: '🎯',
    color: 'from-teal-500 to-blue-500',
  },
  {
    type: 'scribe',
    name: 'Scribe',
    description: 'Écris 10 notes dans ton Journal de Bord',
    icon: '✍️',
    color: 'from-yellow-600 to-amber-700',
  },
  {
    type: 'pleine_conscience',
    name: 'Pleine Conscience',
    description: 'Écris une note 7 jours de suite',
    icon: '🧘',
    color: 'from-green-400 to-teal-500',
  },
  {
    type: 'aura_montante',
    name: 'Aura Montante',
    description: 'Valide 3 jours de suite',
    icon: '✨',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    type: 'insubmersible',
    name: 'Insubmersible',
    description: 'Reprends après un échec (Hier manqué, Aujourd\'hui OK)',
    icon: '⚓',
    color: 'from-blue-700 to-indigo-900',
  },
  {
    type: 'chasseur_penalites',
    name: 'Chasseur de Pénalités',
    description: 'Valide une activité avec une pénalité active',
    icon: '🎯',
    color: 'from-orange-700 to-red-800',
  },
  {
    type: 'architecte',
    name: 'Architecte',
    description: 'Crée au moins 5 activités différentes',
    icon: '🏗️',
    color: 'from-gray-600 to-slate-800',
  },
  {
    type: 'visionnaire',
    name: 'Visionnaire',
    description: 'Crée ton premier objectif hebdomadaire ou mensuel',
    icon: '🔭',
    color: 'from-purple-600 to-indigo-800',
  },
];

const checkPerfectPeriod = (days: number, activities: Activity[], logs: DailyLog[]): boolean => {
  if (activities.length === 0) return false;
  const dates = getDateRange(days);
  // Remove today if it's not finished yet (but we want to allow earning it as soon as today is done)
  // Let's check all days including today.
  return dates.every(date => {
    const scheduled = activities.filter(a => isActivityScheduledForDate(a, date));
    if (scheduled.length === 0) return true;
    const completed = logs.filter(l => l.date === date && l.completed);
    return scheduled.length === completed.length;
  });
};

export const checkNewBadges = (
  activities: Activity[],
  logs: DailyLog[],
  notes: DailyNote[],
  goals: Goal[],
  currentBadges: Badge[]
): Badge[] => {
  const newBadges: Badge[] = [];
  const stats = calculateStats(activities, logs);
  const earnedTypes = new Set(currentBadges.map(b => b.type));
  const today = getTodayDate();

  const addBadge = (type: Badge['type']) => {
    if (!earnedTypes.has(type)) {
      newBadges.push({
        id: crypto.randomUUID(),
        type,
        earnedAt: new Date().toISOString(),
      });
      earnedTypes.add(type);
    }
  };

  // Streak badges
  if (stats.currentStreak >= 3) addBadge('aura_montante');
  if (stats.currentStreak >= 7) addBadge('streak_7');
  if (stats.currentStreak >= 30) addBadge('streak_30');
  if (stats.currentStreak >= 100) addBadge('streak_100');

  // Perfect periods
  if (checkPerfectPeriod(7, activities, logs)) addBadge('perfect_week');
  if (checkPerfectPeriod(30, activities, logs)) addBadge('perfect_month');

  // Activity count badges
  const totalCompleted = logs.filter(l => l.completed).length;
  if (totalCompleted >= 100) addBadge('activities_100');
  if (totalCompleted >= 500) addBadge('activities_500');

  // Polyvalent
  const categoriesHit = new Set(
    logs
      .filter(l => l.completed)
      .map(l => activities.find(a => a.id === l.activityId)?.category)
      .filter(Boolean)
  );
  if (categoriesHit.size >= 5) addBadge('polyvalent');

  // Specialiste
  const categoryCounts: Record<string, number> = {};
  logs.filter(l => l.completed).forEach(l => {
    const cat = activities.find(a => a.id === l.activityId)?.category;
    if (cat) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  });
  if (Object.values(categoryCounts).some(count => count >= 30)) addBadge('specialiste');

  // Guerrier du Dimanche (Completion on Sat/Sun of the current or previous weekend)
  const lastSat = new Date();
  lastSat.setDate(lastSat.getDate() - ((lastSat.getDay() + 1) % 7)); // Last Sat
  const lastSun = new Date(lastSat);
  lastSun.setDate(lastSun.getDate() + 1); // Last Sun

  const satStr = lastSat.toISOString().split('T')[0];
  const sunStr = lastSun.toISOString().split('T')[0];

  const satLogs = logs.filter(l => l.date === satStr && l.completed);
  const sunLogs = logs.filter(l => l.date === sunStr && l.completed);
  const satSched = activities.filter(a => isActivityScheduledForDate(a, satStr));
  const sunSched = activities.filter(a => isActivityScheduledForDate(a, sunStr));

  if (satSched.length > 0 && sunSched.length > 0 &&
    satLogs.length === satSched.length && sunLogs.length === sunSched.length) {
    addBadge('guerrier_dimanche');
  }

  // Scribe & Pleine Conscience
  if (notes.length >= 10) addBadge('scribe');

  let noteStreak = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    if (notes.some(n => n.date === dStr)) noteStreak++;
    else break;
  }
  if (noteStreak >= 7) addBadge('pleine_conscience');

  // Insubmersible
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const yesterdayLogs = logs.filter(l => l.date === yesterdayStr && l.completed);
  const todayLogs = logs.filter(l => l.date === today && l.completed);
  const yesterdaySched = activities.filter(a => isActivityScheduledForDate(a, yesterdayStr));
  const todaySched = activities.filter(a => isActivityScheduledForDate(a, today));

  if (yesterdaySched.length > 0 && yesterdayLogs.length < yesterdaySched.length &&
    todaySched.length > 0 && todayLogs.length === todaySched.length) {
    addBadge('insubmersible');
  }

  // Chasseur de Pénalités
  const activePenalties = calculatePenalties(activities, logs, today);
  const completedTodayWithPenalty = logs.some(l =>
    l.date === today && l.completed && activePenalties.some(p => p.activityId === l.activityId)
  );
  if (completedTodayWithPenalty) addBadge('chasseur_penalites');

  // Architecte & Visionnaire
  if (activities.length >= 5) addBadge('architecte');
  if (goals.length >= 1) addBadge('visionnaire');

  // Time-based (Existing)
  const completedLogs = logs.filter(l => l.completed && l.completedAt);
  if (completedLogs.some(log => new Date(log.completedAt!).getHours() < 7)) addBadge('early_bird');
  if (completedLogs.some(log => new Date(log.completedAt!).getHours() >= 23)) addBadge('night_owl');

  return newBadges;
};

export const getBadgeDefinition = (type: Badge['type']): BadgeDefinition | undefined => {
  return BADGE_DEFINITIONS.find(b => b.type === type);
};
