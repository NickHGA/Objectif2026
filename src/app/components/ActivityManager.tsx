import { useState } from 'react';
import { Activity, ActivityType, Category, WeekDay } from '../types';
import { ArrowLeft, Plus, Trash2, Edit2, Clock, Hash, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryColor, getCategoryLabel } from '../utils/statsUtils';
import { getWeekDayFullName } from '../utils/penaltyUtils';

interface ActivityManagerProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  onDeleteActivity: (id: string) => void;
  onNavigate: (view: 'dashboard' | 'activities' | 'stats') => void;
}

export function ActivityManager({
  activities,
  onAddActivity,
  onDeleteActivity,
  onNavigate
}: ActivityManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'time' as ActivityType,
    value: 30,
    unit: 'min',
    category: 'etudes' as Category,
    weekDays: [] as WeekDay[],
    penaltyDays: 3,
    penaltyIncrease: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddActivity({
      ...formData,
      color: getCategoryColor(formData.category),
      weekDays: formData.weekDays.length > 0 ? formData.weekDays : undefined,
    });

    setFormData({
      name: '',
      type: 'time',
      value: 30,
      unit: 'min',
      category: 'etudes',
      weekDays: [],
      penaltyDays: 3,
      penaltyIncrease: 10,
    });
    setShowForm(false);
    onNavigate('dashboard');
  };

  const handleTypeChange = (type: ActivityType) => {
    setFormData({
      ...formData,
      type,
      unit: type === 'time' ? 'min' : 'fois',
      value: type === 'time' ? 30 : 10,
    });
  };

  const toggleWeekDay = (day: WeekDay) => {
    setFormData({
      ...formData,
      weekDays: formData.weekDays.includes(day)
        ? formData.weekDays.filter(d => d !== day)
        : [...formData.weekDays, day].sort(),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-30 glass-effect border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-3 rounded-2xl bg-muted hover:bg-primary/10 text-foreground transition-all active:scale-90"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Mes Activités</h1>
            <button
              onClick={() => setShowForm(true)}
              className="p-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-90"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Activity form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="mb-10 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6 sm:space-y-8 overflow-hidden"
            >
              <h2 className="text-xl font-black tracking-tight">Nouvelle activité</h2>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nom de l'activité</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Méditation, Sport, Lecture..."
                  className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                />
              </div>

              {/* Type Grid */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Type de mesure</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('time')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'time'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                  >
                    <Clock className="w-6 h-6" />
                    <span className="text-sm font-black uppercase tracking-wider">Temps</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('quantity')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === 'quantity'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                      }`}
                  >
                    <Hash className="w-6 h-6" />
                    <span className="text-sm font-black uppercase tracking-wider">Quantité</span>
                  </button>
                </div>
              </div>

              {/* Value & Unit Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Valeur par défaut</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Unité</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground font-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Category Grid - Responsive wrapping */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Catégorie</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                  {(['sport', 'etudes', 'projet', 'sante', 'autre'] as Category[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 ${formData.category === cat
                        ? 'border-primary bg-primary/10 text-primary scale-[1.05]'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-background"
                        style={{ backgroundColor: getCategoryColor(cat) }}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">{getCategoryLabel(cat)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Week Days - Grid grid-cols-4 for mobile, sm:grid-cols-7 for desktop */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Programmation</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {([1, 2, 3, 4, 5, 6, 0] as WeekDay[]).map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeekDay(day)}
                      className={`p-3 rounded-xl border-2 transition-all ${formData.weekDays.includes(day)
                        ? 'border-primary bg-primary/10 text-primary font-black'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted font-bold'
                        }`}
                    >
                      <span className="text-[11px] uppercase tracking-tighter">{getWeekDayFullName(day).slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Penalty Section */}
              <div className="p-5 rounded-3xl bg-muted/50 border border-border space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-accent/20 text-accent">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <label className="text-xs font-black uppercase tracking-widest text-accent">Système de Punition</label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Durée (jours)</label>
                    <input
                      type="number"
                      value={formData.penaltyDays}
                      onChange={(e) => setFormData({ ...formData, penaltyDays: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl font-black text-foreground"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Majoration</label>
                    <input
                      type="number"
                      value={formData.penaltyIncrease}
                      onChange={(e) => setFormData({ ...formData, penaltyIncrease: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl font-black text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-muted-foreground hover:bg-muted transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Créer
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Activities list */}
        {activities.length === 0 ? (
          <div className="text-center py-24 sm:py-32">
            <p className="text-muted-foreground font-bold mb-8">Aucune activité créée</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-10 py-5 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-3 mx-auto"
            >
              <Plus className="w-6 h-6" />
              Créer ma première activité
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 sm:p-6 rounded-3xl bg-card border border-border hover:shadow-lg transition-all group"
              >
                {/* Activity Item Content */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-5 h-5 rounded-full ring-2 ring-background shadow-md flex-shrink-0"
                      style={{ backgroundColor: activity.color }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-black text-lg text-foreground truncate">{activity.name}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {activity.value} {activity.unit} • {getCategoryLabel(activity.category)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="p-2 rounded-xl bg-destructive/5 text-destructive opacity-40 hover:opacity-100 hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="pt-4 border-t border-muted grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {activity.weekDays && activity.weekDays.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {activity.weekDays.map(day => (
                          <span key={day} className="px-1.5 py-0.5 rounded bg-primary/5 text-primary">
                            {getWeekDayFullName(day).slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span>Tous les jours</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent/70 ml-auto sm:ml-0">
                    <span className="px-2 py-0.5 rounded-full bg-accent/10">Pénalité: +{activity.penaltyIncrease} {activity.unit} / {activity.penaltyDays}j</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}