export type ActivityType = 'time' | 'quantity';

export type Category = 'sport' | 'etudes' | 'projet' | 'sante' | 'autre';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  value: number; // minutes for time, or quantity
  unit: string; // 'min', 'pompes', 'pages', etc.
  category: Category;
  color: string;
  createdAt: string;
  weekDays?: WeekDay[]; // Days of week this activity is scheduled (empty = every day)
  penaltyDays?: number; // Number of days to apply penalty (default: 3)
  penaltyIncrease?: number; // Value to add as penalty (default: 10)
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  activityId: string;
  completed: boolean;
  actualValue?: number;
  comment?: string;
  completedAt?: string;
}

export interface Penalty {
  activityId: string;
  startDate: string;
  endDate: string;
  missedDate: string;
  increaseValue: number;
}

export interface Stats {
  totalActivities: number;
  completedToday: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // in minutes
  categoryBreakdown: Record<Category, number>;
}