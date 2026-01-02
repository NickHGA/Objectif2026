import { useState } from 'react';
import { AppSettings, Theme } from '../types';
import { X, Bell, BellOff, Palette } from 'lucide-react';
import { THEMES } from '../utils/themeUtils';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setLocalSettings({ ...localSettings, notifications: true });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl border border-white/10 max-w-md w-full p-6 transition-colors duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Paramètres</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-gray-400" />
              <label className="text-sm text-gray-400">Thème de couleur</label>
            </div>
            <div className="space-y-2">
              {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setLocalSettings({ ...localSettings, theme: key })}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${localSettings.theme === key
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-3 h-8 rounded" style={{ backgroundColor: theme.primary }} />
                        <div className="w-3 h-8 rounded" style={{ backgroundColor: theme.secondary }} />
                        <div className="w-3 h-8 rounded" style={{ backgroundColor: theme.accent }} />
                      </div>
                      <span className="text-white font-semibold">{theme.name}</span>
                    </div>
                    {localSettings.theme === key && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                {localSettings.notifications ? (
                  <Bell className="w-5 h-5 text-primary" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-white font-semibold">Notifications</p>
                  <p className="text-xs text-gray-400">Rappels quotidiens</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!localSettings.notifications) {
                    requestNotificationPermission();
                  } else {
                    setLocalSettings({ ...localSettings, notifications: false });
                  }
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${localSettings.notifications ? 'bg-primary' : 'bg-gray-600'
                  }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${localSettings.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {localSettings.notifications && (
              <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <label className="block text-sm text-gray-400 mb-2">Heure du rappel</label>
                <input
                  type="time"
                  value={localSettings.notificationTime || '20:00'}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, notificationTime: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
