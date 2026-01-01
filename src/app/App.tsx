import { useState } from 'react';
import { Activity, DailyLog } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { ActivityManager } from './components/ActivityManager';
import { Statistics } from './components/Statistics';
import { getTodayDate } from './utils/dateUtils';

type View = 'dashboard' | 'activities' | 'stats';

export default function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', []);
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('logs', []);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleAddActivity = (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setActivities([...activities, newActivity]);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
    // Also remove all logs for this activity
    setLogs(logs.filter(l => l.activityId !== id));
  };

  const handleToggleActivity = (activityId: string, value?: number, comment?: string) => {
    const today = getTodayDate();
    const existingLog = logs.find(
      log => log.activityId === activityId && log.date === today
    );

    if (existingLog) {
      // Toggle existing log
      setLogs(
        logs.map(log =>
          log.id === existingLog.id
            ? { ...log, completed: !log.completed, completedAt: new Date().toISOString() }
            : log
        )
      );
    } else {
      // Create new log
      const newLog: DailyLog = {
        id: crypto.randomUUID(),
        date: today,
        activityId,
        completed: true,
        actualValue: value,
        comment,
        completedAt: new Date().toISOString(),
      };
      setLogs([...logs, newLog]);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {currentView === 'dashboard' && (
        <Dashboard
          activities={activities}
          logs={logs}
          onToggleActivity={handleToggleActivity}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'activities' && (
        <ActivityManager
          activities={activities}
          onAddActivity={handleAddActivity}
          onDeleteActivity={handleDeleteActivity}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'stats' && (
        <Statistics
          activities={activities}
          logs={logs}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  );
}
