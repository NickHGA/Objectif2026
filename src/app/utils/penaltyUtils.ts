import { Activity, DailyLog, Penalty } from '../types';

export const calculatePenalties = (
  activities: Activity[],
  logs: DailyLog[],
  date: string
): Penalty[] => {
  const penalties: Penalty[] = [];
  const currentDate = new Date(date);

  activities.forEach(activity => {
    const penaltyDays = activity.penaltyDays || 3;
    const penaltyIncrease = activity.penaltyIncrease || 10;
    const activityCreatedDate = new Date(activity.createdAt);

    // Check the last penaltyDays days for missed activities
    for (let i = 1; i <= penaltyDays; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];

      // Don't apply penalty for days before activity was created
      if (checkDate < activityCreatedDate) {
        continue;
      }

      // Check if activity was scheduled for that day
      if (!isActivityScheduledForDate(activity, checkDateStr)) {
        continue;
      }

      // Check if activity was completed
      const log = logs.find(
        l => l.activityId === activity.id && l.date === checkDateStr
      );

      if (!log || !log.completed) {
        // Activity was missed, add penalty
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + (penaltyDays - i));

        penalties.push({
          activityId: activity.id,
          startDate: checkDateStr,
          endDate: endDate.toISOString().split('T')[0],
          missedDate: checkDateStr,
          increaseValue: penaltyIncrease,
        });
      }
    }
  });

  return penalties;
};

export const getActivePenalties = (
  penalties: Penalty[],
  activityId: string,
  date: string
): Penalty[] => {
  return penalties.filter(
    p =>
      p.activityId === activityId &&
      new Date(date) >= new Date(p.startDate) &&
      new Date(date) <= new Date(p.endDate)
  );
};

export const getTotalPenaltyValue = (
  penalties: Penalty[],
  activityId: string,
  date: string
): number => {
  const activePenalties = getActivePenalties(penalties, activityId, date);
  return activePenalties.reduce((sum, p) => sum + p.increaseValue, 0);
};

export const isActivityScheduledForDate = (
  activity: Activity,
  date: string
): boolean => {
  // If no weekDays specified, it's scheduled every day
  if (!activity.weekDays || activity.weekDays.length === 0) {
    return true;
  }

  const dayOfWeek = new Date(date).getDay();
  return activity.weekDays.includes(dayOfWeek as any);
};

export const getWeekDayName = (day: number): string => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return days[day];
};

export const getWeekDayFullName = (day: number): string => {
  const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];
  return days[day];
};