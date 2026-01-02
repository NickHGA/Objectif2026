import { useState } from 'react';
import { Activity, DailyLog, DailyNote, Penalty } from '../types';
import { X, CheckCircle2, Circle, MessageSquare, Clock, Hash, Calendar } from 'lucide-react';
import { getCategoryLabel } from '../utils/statsUtils';
import { formatDate } from '../utils/dateUtils';
import { getActivePenalties } from '../utils/penaltyUtils';

interface DayDetailModalProps {
    date: string;
    activities: Activity[];
    logs: DailyLog[];
    notes: DailyNote[];
    onClose: () => void;
    onSaveNote: (date: string, mood: DailyNote['mood'], note: string) => void;
}

export function DayDetailModal({ date, activities, logs, notes, onClose, onSaveNote }: DayDetailModalProps) {
    const [isEditingNote, setIsEditingNote] = useState(false);
    const dayLogs = logs.filter(l => l.date === date);
    const dayNote = notes.find(n => n.date === date);
    const [noteText, setNoteText] = useState(dayNote?.note || '');
    const [mood, setMood] = useState<DailyNote['mood']>(dayNote?.mood || 'good');

    const formattedDate = formatDate(date);

    const handleSave = () => {
        onSaveNote(date, mood, noteText);
        setIsEditingNote(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-background rounded-2xl border border-white/10 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-500">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white">{formattedDate}</h2>
                        <p className="text-sm text-gray-400">Détails de la journée</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Note Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Note du jour</h3>
                            {!isEditingNote && (
                                <button
                                    onClick={() => setIsEditingNote(true)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    {dayNote ? 'Modifier' : 'Ajouter'}
                                </button>
                            )}
                        </div>

                        {isEditingNote ? (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    {(['great', 'good', 'okay', 'bad'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMood(m)}
                                            className={`text-2xl p-2 rounded-lg border-2 transition-all ${mood === m ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5'}`}
                                        >
                                            {m === 'great' ? '🤩' : m === 'good' ? '😊' : m === 'okay' ? '😐' : '😔'}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary h-24 resize-none"
                                    placeholder="Écris tes réflexions..."
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditingNote(false)} className="flex-1 py-2 text-xs text-gray-400 hover:bg-white/5 rounded-lg border border-white/10 transition-colors">Annuler</button>
                                    <button onClick={handleSave} className="flex-1 py-2 text-xs bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition-colors">Enregistrer</button>
                                </div>
                            </div>
                        ) : dayNote ? (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{dayNote.mood === 'great' ? '🤩' : dayNote.mood === 'good' ? '😊' : dayNote.mood === 'okay' ? '😐' : '😔'}</span>
                                    <span className="font-semibold text-white capitalize">{dayNote.mood}</span>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{dayNote.note}"</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Aucune note enregistrée pour ce jour.</p>
                        )}
                    </section>

                    {/* Activities Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Activités complétées</h3>
                        <div className="space-y-3">
                            {dayLogs.length > 0 ? (
                                dayLogs.map(log => {
                                    const activity = activities.find(a => a.id === log.activityId);
                                    if (!activity) return null;
                                    return (
                                        <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <h4 className="font-medium text-white">{activity.name}</h4>
                                                    <p className="text-xs text-gray-400">
                                                        {log.actualValue || activity.value} {activity.unit} • {getCategoryLabel(activity.category)}
                                                    </p>
                                                </div>
                                            </div>
                                            {log.comment && (
                                                <div className="flex items-center gap-1 text-primary">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span className="text-xs italic">Note</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500 italic">Aucune activité n'a été marquée ce jour-là.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-semibold transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
