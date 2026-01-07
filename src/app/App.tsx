import { useState, useEffect } from 'react';
import { Activity, DailyLog, DailyNote, Goal, Badge, AppSettings, Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './components/Dashboard';
import { ActivityManager } from './components/ActivityManager';
import { Statistics } from './components/Statistics';
import { CalendarView } from './components/CalendarView';
import { DailyNoteModal } from './components/DailyNoteModal';
import { SettingsModal } from './components/SettingsModal';
import { GoalModal } from './components/GoalModal';
import { DayDetailModal } from './components/DayDetailModal';
import { BadgeNotification } from './components/BadgeNotification';
import { getTodayDate } from './utils/dateUtils';
import { checkNewBadges } from './utils/badgeUtils';
import { createWeeklyGoal, createMonthlyGoal } from './utils/goalUtils';
import { applyTheme } from './utils/themeUtils';
import { Settings } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'activities' | 'stats' | 'calendar' | 'settings';

export default function App() {
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', []);
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('logs', []);
  const [notes, setNotes] = useLocalStorage<DailyNote[]>('notes', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [badges, setBadges] = useLocalStorage<Badge[]>('badges', []);
  const [settings, setSettings] = useLocalStorage<AppSettings>('settings', {
    theme: 'dark-default',
    notifications: false,
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDayDetailModal, setShowDayDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Check for new badges whenever relevant data changes
  useEffect(() => {
    const newBadges = checkNewBadges(activities, logs, notes, goals, badges);
    if (newBadges.length > 0) {
      setBadges([...badges, ...newBadges]);
      setNewBadge(newBadges[0]); // Show first new badge
    }
  }, [logs.length, notes.length, goals.length, activities.length]);

  // Setup notifications
  useEffect(() => {
    if (settings.notifications && settings.notificationTime && 'Notification' in window) {
      const checkTime = () => {
        const now = new Date();
        const [hours, minutes] = settings.notificationTime!.split(':').map(Number);
        if (now.getHours() === hours && now.getMinutes() === minutes) {
          if (Notification.permission === 'granted') {
            new Notification('AURA', {
              body: 'Taf fort pour booster ton aura ! N\'oublie pas tes activités. 💪',
              icon: '/icon.png',
            });
          }
        }
      };

      const interval = setInterval(checkTime, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [settings.notifications, settings.notificationTime]);


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

  const handleSaveNote = (mood: DailyNote['mood'], note: string, customDate?: string) => {
    const targetDate = customDate || getTodayDate();
    const existingNote = notes.find(n => n.date === targetDate);

    if (existingNote) {
      setNotes(
        notes.map(n =>
          n.id === existingNote.id
            ? { ...n, mood, note }
            : n
        )
      );
    } else {
      const newNote: DailyNote = {
        id: crypto.randomUUID(),
        date: targetDate,
        mood,
        note,
        createdAt: new Date().toISOString(),
      };
      setNotes([...notes, newNote]);
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    applyTheme(newSettings.theme);
  };

  const handleCreateGoal = (type: Goal['type'], targetRate: number) => {
    const newGoal = type === 'weekly'
      ? createWeeklyGoal(targetRate)
      : createMonthlyGoal(targetRate);
    setGoals([...goals, newGoal]);
  };

  const handleNavigate = (view: View) => {
    if (view === 'settings') {
      setShowSettingsModal(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setShowDayDetailModal(true);
  };

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-500">
      {currentView === 'dashboard' && (
        <Dashboard
          activities={activities}
          logs={logs}
          notes={notes}
          goals={goals}
          onToggleActivity={handleToggleActivity}
          onNavigate={handleNavigate}
          onOpenNoteModal={() => setShowNoteModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {currentView === 'activities' && (
        <ActivityManager
          activities={activities}
          onAddActivity={handleAddActivity}
          onDeleteActivity={handleDeleteActivity}
          onNavigate={handleNavigate as any}
        />
      )}

      {currentView === 'stats' && (
        <Statistics
          activities={activities}
          logs={logs}
          badges={badges}
          goals={goals}
          onNavigate={handleNavigate}
          onCreateGoal={() => setShowGoalModal(true)}
        />
      )}

      {currentView === 'calendar' && (
        <CalendarView
          activities={activities}
          logs={logs}
          onNavigate={handleNavigate as any}
          onSelectDate={handleSelectDate}
        />
      )}

      {/* Modals */}
      {showNoteModal && (
        <DailyNoteModal
          existingNote={notes.find(n => n.date === getTodayDate())}
          date={getTodayDate()}
          onSave={handleSaveNote}
          onClose={() => setShowNoteModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showGoalModal && (
        <GoalModal
          onSave={handleCreateGoal}
          onClose={() => setShowGoalModal(false)}
        />
      )}

      {showDayDetailModal && selectedDate && (
        <DayDetailModal
          date={selectedDate}
          activities={activities}
          logs={logs}
          notes={notes}
          onClose={() => setShowDayDetailModal(false)}
          onSaveNote={(date, mood, note) => handleSaveNote(mood, note, date)}
        />
      )}

      {/* Badge notification */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}

      {/* Confetti effect */}

    </div>
  );
}