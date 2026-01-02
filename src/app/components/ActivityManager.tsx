import { useState } from 'react';
import { Activity, ActivityType, Category, WeekDay } from '../types';
import { ArrowLeft, Plus, Trash2, Edit2, Clock, Hash, Calendar } from 'lucide-react';
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

    const category = formData.category;
    onAddActivity({
      ...formData,
      color: getCategoryColor(category),
      weekDays: formData.weekDays.length > 0 ? formData.weekDays : undefined,
    });

    // Reset form
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
            <h1 className="text-xl font-bold">Mes activités</h1>
            <button
              onClick={() => setShowForm(true)}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Activity form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-lg font-semibold">Nouvelle activité</h2>

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nom de l'activité</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Anglais, Pompes, Lecture..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('time')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === 'time'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Temps</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('quantity')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === 'quantity'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <Hash className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Quantité</p>
                </button>
              </div>
            </div>

            {/* Value & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Valeur</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Unité</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="min, fois..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {(['sport', 'etudes', 'projet', 'sante', 'autre'] as Category[]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.category === cat
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: getCategoryColor(cat) }}
                    />
                    <p className="text-xs">{getCategoryLabel(cat)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Week Days */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Jours de la semaine (vide = tous les jours)</label>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4, 5, 6, 0] as WeekDay[]).map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWeekDay(day)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.weekDays.includes(day)
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <p className="text-xs font-semibold">{getWeekDayFullName(day)}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Sélectionne les jours où cette activité doit être faite
              </p>
            </div>

            {/* Penalty */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Système de punition</label>
              <p className="text-xs text-gray-500 mb-3">
                Si tu manques cette activité, elle sera augmentée les jours suivants
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Nombre de jours</label>
                  <input
                    type="number"
                    value={formData.penaltyDays}
                    onChange={(e) => setFormData({ ...formData, penaltyDays: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="7"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Augmentation</label>
                  <input
                    type="number"
                    value={formData.penaltyIncrease}
                    onChange={(e) => setFormData({ ...formData, penaltyIncrease: parseInt(e.target.value) || 1 })}
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Créer
              </button>
            </div>
          </form>
        )}

        {/* Activities list */}
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Aucune activité créée</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer ma première activité
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map(activity => (
              <div
                key={activity.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: activity.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-white">{activity.name}</h3>
                      <p className="text-sm text-gray-400">
                        {activity.value} {activity.unit} • {getCategoryLabel(activity.category)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  {/* Week Days */}
                  {activity.weekDays && activity.weekDays.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="flex gap-1">
                        {activity.weekDays.map(day => (
                          <span 
                            key={day} 
                            className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded"
                          >
                            {getWeekDayFullName(day)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Tous les jours</span>
                    </div>
                  )}

                  {/* Penalty Info */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>⚠️ Pénalité:</span>
                      <span className="text-red-400 font-semibold">
                        +{activity.penaltyIncrease || 10} {activity.unit}
                      </span>
                      <span>pendant</span>
                      <span className="text-red-400 font-semibold">
                        {activity.penaltyDays || 3} jours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}