import { useState } from 'react';
import { Goal } from '../types';
import { X, Target, TrendingUp } from 'lucide-react';

interface GoalModalProps {
  onSave: (type: Goal['type'], targetRate: number) => void;
  onClose: () => void;
}

export function GoalModal({ onSave, onClose }: GoalModalProps) {
  const [goalType, setGoalType] = useState<Goal['type']>('weekly');
  const [targetRate, setTargetRate] = useState(80);

  const handleSave = () => {
    onSave(goalType, targetRate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl border border-white/10 max-w-md w-full p-6 transition-colors duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Nouvel objectif</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Goal type */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Période</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setGoalType('weekly')}
                className={`p-4 rounded-xl border-2 transition-all ${goalType === 'weekly'
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-white">Hebdomadaire</p>
                <p className="text-xs text-gray-400 mt-1">Cette semaine</p>
              </button>

              <button
                onClick={() => setGoalType('monthly')}
                className={`p-4 rounded-xl border-2 transition-all ${goalType === 'monthly'
                    ? 'border-secondary bg-secondary/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <p className="font-semibold text-white">Mensuel</p>
                <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
              </button>
            </div>
          </div>

          {/* Target rate */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Objectif de complétion
            </label>
            <div className="relative">
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={targetRate}
                onChange={(e) => setTargetRate(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-center">
              <p className="text-4xl font-bold text-white mb-1">{targetRate}%</p>
              <p className="text-sm text-gray-300">
                {goalType === 'weekly' ? 'cette semaine' : 'ce mois-ci'}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-xs text-primary/80">
              💡 Tu seras notifié de ta progression et tu pourras voir si tu es en bonne voie pour atteindre ton objectif !
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Créer l'objectif
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
