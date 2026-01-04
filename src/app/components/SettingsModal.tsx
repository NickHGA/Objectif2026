import { useState } from 'react';
import { AppSettings, Theme } from '../types';
import { X, Bell, BellOff, Palette, Check, Settings, Clock } from 'lucide-react';
import { THEMES } from '../utils/themeUtils';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden glass-effect"
      >
        <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Settings className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Paramètres</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl hover:bg-muted text-muted-foreground transition-all active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8 sm:space-y-10 max-h-[70vh] overflow-y-auto">
          {/* Theme Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Ambiance & Style</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setLocalSettings({ ...localSettings, theme: key })}
                  className={`relative p-4 rounded-2xl border-2 transition-all group ${localSettings.theme === key
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/30'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-4 h-10 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: theme.primary }} />
                      <div className="w-4 h-10 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: theme.secondary }} />
                    </div>
                    <span className={`text-sm font-black tracking-tight ${localSettings.theme === key ? 'text-primary' : 'text-foreground'}`}>
                      {theme.name}
                    </span>
                  </div>
                  {localSettings.theme === key && (
                    <motion.div
                      layoutId="activeTheme"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Notifications Section */}
          <section className="space-y-5">
            <div className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${localSettings.notifications ? 'border-primary/20 bg-primary/5' : 'border-border bg-muted/30'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl transition-colors ${localSettings.notifications ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {localSettings.notifications ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Notifications</p>
                  <p className="text-xs font-bold text-muted-foreground">Rappels quotidiens</p>
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
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${localSettings.notifications ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <motion.div
                  animate={{ x: localSettings.notifications ? 26 : 4 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            <AnimatePresence>
              {localSettings.notifications && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-1"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Heure de notification</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={localSettings.notificationTime || '20:00'}
                      onChange={(e) => setLocalSettings({ ...localSettings, notificationTime: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <div className="p-6 sm:p-8 bg-muted/30 border-t border-border flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-border rounded-2xl font-black uppercase text-xs tracking-widest text-muted-foreground hover:bg-muted transition-all active:scale-95"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-foreground text-background font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

