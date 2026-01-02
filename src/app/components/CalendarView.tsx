import { Activity, DailyLog } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { isActivityScheduledForDate } from '../utils/penaltyUtils';

interface CalendarViewProps {
  activities: Activity[];
  logs: DailyLog[];
  onNavigate: (view: 'dashboard' | 'activities' | 'stats' | 'calendar') => void;
  onSelectDate: (date: string) => void;
}

export function CalendarView({ activities, logs, onNavigate, onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getDayStatus = (date: Date | null) => {
    if (!date) return null;
    
    const dateStr = date.toISOString().split('T')[0];
    const scheduledActivities = activities.filter(a => 
      isActivityScheduledForDate(a, dateStr) &&
      new Date(a.createdAt) <= date
    );
    
    if (scheduledActivities.length === 0) return 'none';
    
    const dayLogs = logs.filter(l => l.date === dateStr);
    const completed = dayLogs.filter(l => l.completed).length;
    const total = scheduledActivities.length;
    
    if (completed === 0) return 'missed';
    if (completed === total) return 'perfect';
    return 'partial';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold capitalize">{monthName}</h1>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/30 border-2 border-green-500" />
            <span className="text-gray-400">100% complété</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/30 border-2 border-yellow-500" />
            <span className="text-gray-400">Partiellement complété</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/30 border-2 border-red-500" />
            <span className="text-gray-400">Raté</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white/5 border-2 border-white/10" />
            <span className="text-gray-400">Pas d'activité</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-center text-xs text-gray-400 font-semibold py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square" />;
              }

              const dateStr = date.toISOString().split('T')[0];
              const status = getDayStatus(date);
              const isToday = dateStr === today;
              const isFuture = date > new Date();

              let bgColor = 'bg-white/5 border-white/10';
              if (status === 'perfect') bgColor = 'bg-green-500/30 border-green-500';
              else if (status === 'partial') bgColor = 'bg-yellow-500/30 border-yellow-500';
              else if (status === 'missed') bgColor = 'bg-red-500/30 border-red-500';

              return (
                <button
                  key={index}
                  onClick={() => onSelectDate(dateStr)}
                  disabled={isFuture}
                  className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${bgColor} ${
                    isToday ? 'ring-2 ring-blue-500' : ''
                  } ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className={`text-sm ${isToday ? 'font-bold text-blue-400' : 'text-white'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
