import { useState } from 'react';
import { Activity, DailyLog, Penalty } from '../types';
import { CheckCircle2, Circle, Clock, Hash, MessageSquare, AlertTriangle } from 'lucide-react';
import { getCategoryColor } from '../utils/statsUtils';
import { getTotalPenaltyValue, getWeekDayName } from '../utils/penaltyUtils';

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

  const handleToggle = () => {
    if (!isCompleted) {
      onToggle(activity.id, totalValue, comment || undefined);
      setShowComment(false);
    }
  };

  const activeBorderColor = isCompleted
    ? 'border-green-500/50'
    : hasPenalty
      ? 'border-red-500/30 hover:border-red-500/50'
      : 'border-white/10 hover:border-white/20';

  const activeBgColor = isCompleted
    ? 'bg-white/5'
    : hasPenalty
      ? 'bg-red-500/5'
      : 'bg-white/[0.02]';

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all duration-300 ${activeBgColor} ${activeBorderColor}`}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 transition-all ${isCompleted ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-7 h-7 text-green-500" />
          ) : (
            <Circle className="w-7 h-7 text-gray-500 hover:text-primary" />
          )}
        </button>

        {/* Activity info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
              {activity.name}
            </h3>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            {/* Week days indicator */}
            {activity.weekDays && activity.weekDays.length > 0 && (
              <div className="flex gap-1 ml-1">
                {activity.weekDays.map(day => (
                  <span key={day} className="text-xs text-gray-500 bg-white/5 px-1 rounded">
                    {getWeekDayName(day)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              {activity.type === 'time' ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Hash className="w-4 h-4" />
              )}
              <span className={hasPenalty && !isCompleted ? 'text-red-400 font-semibold' : ''}>
                {totalValue} {activity.unit}
                {hasPenalty && !isCompleted && (
                  <span className="text-xs ml-1">
                    (+{penaltyValue})
                  </span>
                )}
              </span>
            </div>

            {hasPenalty && !isCompleted && (
              <div className="flex items-center gap-1 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-semibold">Pénalité active</span>
              </div>
            )}

            {log?.comment && (
              <div className="flex items-center gap-1 text-primary">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs italic">{log.comment}</span>
              </div>
            )}
          </div>
        </div>

        {/* Comment toggle */}
        {!isCompleted && (
          <button
            onClick={() => setShowComment(!showComment)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <MessageSquare className={`w-5 h-5 ${showComment ? 'text-primary' : 'text-gray-500'}`} />
          </button>
        )}
      </div>

      {/* Comment input */}
      {showComment && !isCompleted && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>
      )}
    </div>
  );
}