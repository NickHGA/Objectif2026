import { Activity, DailyLog, DailyNote, Goal, WeekDay } from '../types';
import { ActivityCard } from './ActivityCard';
import { getTodayDate, formatDate } from '../utils/dateUtils';
import { Calendar, History, Plus, BookOpen, Settings, Target, TrendingUp, Search, Filter, Clock, ArrowUpRight, CheckSquare } from 'lucide-react';
import { isActivityScheduledForDate, calculatePenalties } from '../utils/penaltyUtils';
import { getActiveGoal, calculateGoalProgress } from '../utils/goalUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardProps {
  activities: Activity[];
  logs: DailyLog[];
  notes: DailyNote[];
  goals: Goal[];
  onToggleActivity: (activityId: string, value?: number, comment?: string) => void;
  onNavigate: (view: 'dashboard' | 'activities' | 'stats' | 'calendar' | 'settings') => void;
  onOpenNoteModal: () => void;
  onOpenSettings: () => void;
}

export function Dashboard({
  activities,
  logs,
  notes,
  goals,
  onToggleActivity,
  onNavigate,
  onOpenNoteModal,
  onOpenSettings
}: DashboardProps) {
  const today = getTodayDate();
  const todayLogs = logs.filter(log => log.date === today);
  const todayNote = notes.find(note => note.date === today);

  const todayActivities = activities.filter(activity =>
    isActivityScheduledForDate(activity, today)
  );

  const penalties = calculatePenalties(activities, logs, today);

  const completedCount = todayLogs.filter(log => log.completed).length;
  const totalCount = todayActivities.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activeGoal = getActiveGoal(goals, today);
  const goalProgress = activeGoal ? calculateGoalProgress(activeGoal, activities, logs) : null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-24 sm:pb-8">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 glass-effect border-b border-border/50"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground leading-none">
                AURA
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary">
                  Taf fort pour plus d'aura
                </p>
                <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border" />
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {format(new Date(), 'EEEE d MMMM', { locale: fr })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('calendar')}
                className="p-2 sm:p-3 rounded-2xl bg-muted hover:bg-primary/10 text-foreground transition-all active:scale-95 group"
                title="Calendrier"
              >
                <History className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-primary transition-colors" />
              </button>
              <button
                onClick={() => onNavigate('stats')}
                className="p-2 sm:p-3 rounded-2xl bg-muted hover:bg-secondary/10 text-foreground transition-all active:scale-95"
                title="Stats"
              >
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={onOpenSettings}
                className="hidden sm:flex p-3 rounded-2xl bg-muted hover:bg-accent/10 text-foreground transition-all active:scale-95"
                title="Paramètres"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-black uppercase tracking-widest text-muted-foreground">Progression</span>
              <span className="font-black text-primary">{completionRate}%</span>
            </div>
            <div className="h-3 sm:h-4 bg-muted rounded-full overflow-hidden p-0.5 sm:p-1 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {activeGoal && goalProgress && (
          <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Objectif en cours</span>
              </div>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-black text-foreground">
                  Objectif {activeGoal.type === 'weekly' ? 'hebdomadaire' : 'mensuel'}
                </h3>
                <span className="text-2xl sm:text-3xl font-black text-primary">{goalProgress.rate}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                <motion.div
                  className={`h-full bg-gradient-to-r from-primary to-accent`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(goalProgress.rate, 100)}%` }}
                  transition={{ duration: 1.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {todayActivities.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 sm:py-24"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-6 group">
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black mb-3">
                {activities.length === 0 ? 'Prêt à commencer ?' : 'Journée Zen'}
              </h3>
              <p className="text-muted-foreground mb-10 max-w-xs mx-auto text-balance">
                {activities.length === 0
                  ? 'Créez votre première activité pour transformer votre routine.'
                  : 'Aucune tâche n\'est programmée pour aujourd\'hui. Profitez-en !'}
              </p>
              {activities.length === 0 && (
                <button
                  onClick={() => onNavigate('activities')}
                  className="px-10 py-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all font-black flex items-center gap-3 mx-auto"
                >
                  <Plus className="w-6 h-6" />
                  Créer une activité
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {todayActivities.map((activity, index) => {
                const log = todayLogs.find(l => l.activityId === activity.id);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <ActivityCard
                      activity={activity}
                      log={log}
                      penalties={penalties}
                      currentDate={today}
                      onToggle={onToggleActivity}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 space-y-4"
          >
            <button
              onClick={() => onNavigate('activities')}
              className="w-full py-5 border-2 border-dashed border-border rounded-[2rem] text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest"
            >
              <Plus className="w-5 h-5" />
              Gérer mes activités
            </button>

            <button
              onClick={onOpenNoteModal}
              className={`w-full py-5 rounded-[2rem] transition-all shadow-md flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest ${todayNote
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-700'
                : 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              {todayNote ? 'Affiner ma note' : 'Journal de bord'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button for Mobile Settings */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onOpenSettings}
        className="fixed bottom-6 right-6 sm:hidden w-16 h-16 rounded-[2rem] bg-foreground text-background shadow-2xl flex items-center justify-center z-40"
      >
        <Settings className="w-8 h-8" />
      </motion.button>
    </div>
  );
}