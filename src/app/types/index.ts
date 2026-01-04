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

export interface DailyNote {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 'great' | 'good' | 'okay' | 'bad';
  note: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  type: 'weekly' | 'monthly';
  targetRate: number; // Percentage (0-100)
  startDate: string;
  endDate: string;
  createdAt: string;
}

export type Theme = 'dark-default' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'light-default' | 'mixed-glass';

export interface Badge {
  id: string;
  type: 'streak_7' | 'streak_30' | 'streak_100' | 'perfect_week' | 'perfect_month' | 'activities_100' | 'activities_500' | 'early_bird' | 'night_owl';
  earnedAt: string;
}

export interface AppSettings {
  theme: Theme;
  notifications: boolean;
  notificationTime?: string; // HH:mm format
}

export interface UserData {
  activities: Activity[];
  logs: DailyLog[];
  notes: DailyNote[];
  goals: Goal[];
  badges: Badge[];
  settings: AppSettings;
}