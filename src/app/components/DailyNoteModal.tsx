import { useState } from 'react';
import { DailyNote } from '../types';
import { X, Smile, Meh, Frown, ThumbsDown } from 'lucide-react';

interface DailyNoteModalProps {
  existingNote?: DailyNote;
  date: string;
  onSave: (mood: DailyNote['mood'], note: string) => void;
  onClose: () => void;
}

export function DailyNoteModal({ existingNote, date, onSave, onClose }: DailyNoteModalProps) {
  const [mood, setMood] = useState<DailyNote['mood']>(existingNote?.mood || 'good');
  const [note, setNote] = useState(existingNote?.note || '');

  const handleSave = () => {
    onSave(mood, note);
    onClose();
  };

  const moodOptions = [
    { value: 'great' as const, icon: Smile, label: 'Excellent', color: 'text-green-400' },
    { value: 'good' as const, icon: Smile, label: 'Bien', color: 'text-blue-400' },
    { value: 'okay' as const, icon: Meh, label: 'Correct', color: 'text-yellow-400' },
    { value: 'bad' as const, icon: Frown, label: 'Difficile', color: 'text-red-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl border border-white/10 max-w-md w-full p-6 transition-colors duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Note du jour</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Mood selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Comment s'est passée ta journée ?</label>
            <div className="grid grid-cols-4 gap-2">
              {moodOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setMood(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${mood === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${option.color}`} />
                    <p className="text-xs text-gray-400">{option.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note textarea */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tes réflexions du jour</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Qu'as-tu appris ? Quelles difficultés as-tu rencontrées ?"
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {note.length}/500 caractères
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
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
