import React, { useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import GlassCard from './GlassCard';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
}

interface NotificationToastProps {
  notifications: ToastMessage[];
  onDismiss: (id: string) => void;
  darkMode: boolean;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss, darkMode }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {notifications.map((notif) => (
        <div key={notif.id} className="pointer-events-auto animate-in slide-in-from-right-full fade-in duration-500">
          <GlassCard lightMode={!darkMode} className={`p-4 shadow-2xl border-l-4 ${darkMode ? 'border-l-blue-500 bg-black/40' : 'border-l-blue-500 bg-white/80'}`}>
            <div className="flex justify-between items-start gap-3">
              <div className={`p-2 rounded-full shrink-0 ${darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-0.5">
                <h4 className={`text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {notif.title}
                </h4>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-white/70' : 'text-slate-600'}`}>
                  {notif.message}
                </p>
              </div>
              <button 
                onClick={() => onDismiss(notif.id)}
                className={`p-1 rounded-full transition-colors shrink-0 ${darkMode ? 'hover:bg-white/10 text-white/50 hover:text-white' : 'hover:bg-black/5 text-slate-400 hover:text-slate-800'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;