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
import { BadgeNotification } from './components/BadgeNotification';
import { Confetti } from './components/Confetti';
import { getTodayDate } from './utils/dateUtils';
import { checkNewBadges } from './utils/badgeUtils';
import { createWeeklyGoal, createMonthlyGoal } from './utils/goalUtils';
import { applyTheme } from './utils/themeUtils';
import { Settings } from 'lucide-react';

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
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Check for new badges whenever logs change
  useEffect(() => {
    const newBadges = checkNewBadges(activities, logs, badges);
    if (newBadges.length > 0) {
      setBadges([...badges, ...newBadges]);
      setNewBadge(newBadges[0]); // Show first new badge
    }
  }, [logs.length]);

  // Setup notifications
  useEffect(() => {
    if (settings.notifications && settings.notificationTime && 'Notification' in window) {
      const checkTime = () => {
        const now = new Date();
        const [hours, minutes] = settings.notificationTime!.split(':').map(Number);
        if (now.getHours() === hours && now.getMinutes() === minutes) {
          if (Notification.permission === 'granted') {
            new Notification('Objectif 2026', {
              body: 'N\'oublie pas de compléter tes activités aujourd\'hui ! 💪',
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

      // Trigger confetti for first completion of the day
      const todayLogs = logs.filter(l => l.date === today && l.completed);
      if (todayLogs.length === 0) {
        setShowConfetti(true);
      }
    }
  };

  const handleSaveNote = (mood: DailyNote['mood'], note: string) => {
    const today = getTodayDate();
    const existingNote = notes.find(n => n.date === today);

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
        date: today,
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

  return (
    <div className="bg-black min-h-screen">
      {currentView === 'dashboard' && (
        <Dashboard
          activities={activities}
          logs={logs}
          notes={notes}
          goals={goals}
          onToggleActivity={handleToggleActivity}
          onNavigate={handleNavigate}
          onOpenNoteModal={() => setShowNoteModal(true)}
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

      {/* Badge notification */}
      {newBadge && (
        <BadgeNotification
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}

      {/* Confetti effect */}
      <Confetti
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Settings button overlay */}
      {currentView === 'dashboard' && !showSettingsModal && (
        <button
          onClick={() => setShowSettingsModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center group"
          title="Paramètres"
        >
          <Settings className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}
    </div>
  );
}