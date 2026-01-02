import { Goal, Activity, DailyLog } from '../types';
import { isActivityScheduledForDate } from './penaltyUtils';

export const getActiveGoal = (goals: Goal[], date: string = new Date().toISOString().split('T')[0]): Goal | undefined => {
  return goals.find(goal => {
    const currentDate = new Date(date);
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);
    return currentDate >= startDate && currentDate <= endDate;
  });
};

export const calculateGoalProgress = (
  goal: Goal,
  activities: Activity[],
  logs: DailyLog[]
): { current: number; total: number; rate: number } => {
  const startDate = new Date(goal.startDate);
  const endDate = new Date(goal.endDate);
  
  let totalScheduled = 0;
  let totalCompleted = 0;
  
  // Iterate through each day in the goal period
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    // Count scheduled activities for this day
    const scheduledCount = activities.filter(a => 
      isActivityScheduledForDate(a, dateStr) && 
      new Date(a.createdAt) <= d
    ).length;
    
    totalScheduled += scheduledCount;
    
    // Count completed activities
    const completedCount = logs.filter(l => 
      l.date === dateStr && l.completed
    ).length;
    
    totalCompleted += completedCount;
  }
  
  const rate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;
  
  return {
    current: totalCompleted,
    total: totalScheduled,
    rate,
  };
};

export const createWeeklyGoal = (targetRate: number): Goal => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    id: crypto.randomUUID(),
    type: 'weekly',
    targetRate,
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
};

export const createMonthlyGoal = (targetRate: number): Goal => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  return {
    id: crypto.randomUUID(),
    type: 'monthly',
    targetRate,
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
};

export const predictMonthlyCompletion = (
  activities: Activity[],
  logs: DailyLog[]
): number => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  let totalScheduled = 0;
  let totalCompleted = 0;
  let daysPassed = 0;
  
  // Calculate for days that have passed
  for (let d = new Date(firstDay); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    daysPassed++;
    
    const scheduledCount = activities.filter(a => 
      isActivityScheduledForDate(a, dateStr) && 
      new Date(a.createdAt) <= d
    ).length;
    
    totalScheduled += scheduledCount;
    
    const completedCount = logs.filter(l => 
      l.date === dateStr && l.completed
    ).length;
    
    totalCompleted += completedCount;
  }
  
  if (totalScheduled === 0 || daysPassed === 0) return 0;
  
  const currentRate = totalCompleted / totalScheduled;
  const totalDaysInMonth = lastDay.getDate();
  const avgActivitiesPerDay = totalScheduled / daysPassed;
  
  // Project to end of month
  const projectedTotal = avgActivitiesPerDay * totalDaysInMonth;
  const projectedCompleted = projectedTotal * currentRate;
  
  return Math.round((projectedCompleted / projectedTotal) * 100);
};
