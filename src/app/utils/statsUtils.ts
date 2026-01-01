import { Activity, DailyLog, Stats, Category } from '../types';
import { getTodayDate, getDateRange } from './dateUtils';

export const calculateStats = (
  activities: Activity[],
  logs: DailyLog[]
): Stats => {
  const today = getTodayDate();
  const todayLogs = logs.filter(log => log.date === today);
  const completedToday = todayLogs.filter(log => log.completed).length;
  
  // Calculate current streak
  const currentStreak = calculateStreak(activities, logs);
  
  // Calculate longest streak
  const longestStreak = calculateLongestStreak(activities, logs);
  
  // Calculate total time spent (for time-based activities)
  const totalTimeSpent = logs
    .filter(log => log.completed)
    .reduce((total, log) => {
      const activity = activities.find(a => a.id === log.activityId);
      if (activity && activity.type === 'time') {
        return total + (log.actualValue || activity.value);
      }
      return total;
    }, 0);
  
  // Category breakdown (completion count)
  const categoryBreakdown: Record<Category, number> = {
    sport: 0,
    etudes: 0,
    projet: 0,
    sante: 0,
    autre: 0,
  };
  
  logs.filter(log => log.completed).forEach(log => {
    const activity = activities.find(a => a.id === log.activityId);
    if (activity) {
      categoryBreakdown[activity.category]++;
    }
  });
  
  return {
    totalActivities: activities.length,
    completedToday,
    completionRate: activities.length > 0 
      ? Math.round((completedToday / activities.length) * 100) 
      : 0,
    currentStreak,
    longestStreak,
    totalTimeSpent,
    categoryBreakdown,
  };
};

const calculateStreak = (activities: Activity[], logs: DailyLog[]): number => {
  if (activities.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  // Check backwards from today
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const dayLogs = logs.filter(log => log.date === dateStr);
    const completedCount = dayLogs.filter(log => log.completed).length;
    
    // If all activities were completed that day
    if (completedCount === activities.length && completedCount > 0) {
      streak++;
    } else if (i > 0) {
      // Break streak if not today
      break;
    }
  }
  
  return streak;
};

const calculateLongestStreak = (activities: Activity[], logs: DailyLog[]): number => {
  if (activities.length === 0) return 0;
  
  const dates = getDateRange(365);
  let longestStreak = 0;
  let currentStreakCount = 0;
  
  dates.forEach(date => {
    const dayLogs = logs.filter(log => log.date === date);
    const completedCount = dayLogs.filter(log => log.completed).length;
    
    if (completedCount === activities.length && completedCount > 0) {
      currentStreakCount++;
      longestStreak = Math.max(longestStreak, currentStreakCount);
    } else {
      currentStreakCount = 0;
    }
  });
  
  return longestStreak;
};

export const getCategoryColor = (category: Category): string => {
  const colors = {
    sport: '#10b981', // green
    etudes: '#3b82f6', // blue
    projet: '#8b5cf6', // violet
    sante: '#f59e0b', // amber
    autre: '#6b7280', // gray
  };
  return colors[category];
};

export const getCategoryLabel = (category: Category): string => {
  const labels = {
    sport: 'Sport',
    etudes: 'Études',
    projet: 'Projet',
    sante: 'Santé',
    autre: 'Autre',
  };
  return labels[category];
};
