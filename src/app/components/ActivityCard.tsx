import { useState } from 'react';
import { Activity, DailyLog, Penalty } from '../types';
import { CheckCircle2, Circle, Clock, Hash, MessageSquare, AlertTriangle } from 'lucide-react';
import { getCategoryColor } from '../utils/statsUtils';
import { getTotalPenaltyValue, getWeekDayName } from '../utils/penaltyUtils';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityCardProps {
  activity: Activity;
  log?: DailyLog;
  penalties: Penalty[];
  currentDate: string;
  onToggle: (activityId: string, value?: number, comment?: string) => void;
}

export function ActivityCard({ activity, log, penalties, currentDate, onToggle }: ActivityCardProps) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(log?.comment || '');

  const isCompleted = log?.completed || false;
  const categoryColor = getCategoryColor(activity.category);
  const penaltyValue = getTotalPenaltyValue(penalties, activity.id, currentDate);
  const totalValue = activity.value + penaltyValue;
  const hasPenalty = penaltyValue > 0;

  const handleToggle = () => {
    if (!isCompleted) {
      onToggle(activity.id, totalValue, comment || undefined);
      setShowComment(false);
    }
  };

  const activeBorderColor = isCompleted
    ? 'border-emerald-500/30'
    : hasPenalty
      ? 'border-destructive/30 hover:border-destructive/50'
      : 'border-border hover:border-primary/30';

  const activeBgColor = isCompleted
    ? 'bg-emerald-500/[0.03]'
    : hasPenalty
      ? 'bg-destructive/[0.02]'
      : 'bg-card';

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 glass-effect shadow-sm overflow-hidden relative ${activeBgColor} ${activeBorderColor}`}
    >
      {isCompleted && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-emerald-500"
        />
      )}

      <div className="flex items-start gap-4 relative z-10">
        <button
          onClick={handleToggle}
          disabled={isCompleted}
          className="flex-shrink-0 mt-1 sm:mt-0.5 outline-none"
        >
          <motion.div
            whileTap={!isCompleted ? { scale: 0.8 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-500" />
            ) : (
              <Circle className="w-8 h-8 sm:w-9 sm:h-9 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </motion.div>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className={`font-black text-base sm:text-lg leading-tight break-words ${isCompleted ? 'text-muted-foreground line-through opacity-60' : 'text-foreground'}`}>
              {activity.name}
            </h3>
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-background shadow-sm ml-auto sm:ml-0"
              style={{ backgroundColor: categoryColor }}
            />
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground font-bold">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted">
              {activity.type === 'time' ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <Hash className="w-3.5 h-3.5" />
              )}
              <span className={hasPenalty && !isCompleted ? 'text-destructive font-black' : ''}>
                {totalValue} {activity.unit}
                {hasPenalty && !isCompleted && (
                  <span className="text-[10px] ml-1 opacity-70">
                    (+{penaltyValue})
                  </span>
                )}
              </span>
            </div>

            {hasPenalty && !isCompleted && (
              <div className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] sm:text-xs uppercase tracking-tighter font-black">Pénalité</span>
              </div>
            )}
          </div>
        </div>

        {!isCompleted && (
          <button
            onClick={() => setShowComment(!showComment)}
            className={`p-2.5 rounded-2xl transition-all ${showComment ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isCompleted && log?.comment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-2 ml-12"
          >
            <p className="text-xs italic text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {log.comment}
            </p>
          </motion.div>
        )}

        {showComment && !isCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border">
              <input
                type="text"
                value={comment}
                autoFocus
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}