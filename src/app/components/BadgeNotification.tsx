import { useEffect, useState } from 'react';
import { Badge } from '../types';
import { getBadgeDefinition } from '../utils/badgeUtils';
import { Trophy } from 'lucide-react';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const [show, setShow] = useState(false);
  const definition = getBadgeDefinition(badge.type);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setShow(true), 100);
    
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!definition) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Confetti effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Badge card */}
      <div
        className={`pointer-events-auto transform transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${definition.color} shadow-2xl border-2 border-white/20 max-w-sm mx-4`}>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <div className="text-6xl mb-4">{definition.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Nouveau badge !
            </h3>
            <h4 className="text-xl font-semibold text-white/90 mb-2">
              {definition.name}
            </h4>
            <p className="text-white/80 text-sm">
              {definition.description}
            </p>
          </div>

          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 500);
            }}
            className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-colors"
          >
            Génial ! 🎉
          </button>
        </div>
      </div>
    </div>
  );
}
