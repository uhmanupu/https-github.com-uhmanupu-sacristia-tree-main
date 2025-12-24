import React, { useState } from 'react';
import { X, Bell, Moon, Type, Info, ChevronRight, Sun, Shield } from 'lucide-react';
import GlassCard from './GlassCard';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  toggleDarkMode,
  notificationsEnabled,
  toggleNotifications
}) => {
  const [fontSize, setFontSize] = useState('medium');

  if (!isOpen) return null;

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${active ? 'bg-blue-500' : 'bg-black/10 border border-black/10 dark:bg-white/10 dark:border-white/20'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <GlassCard lightMode={!darkMode} className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>Configurações</h2>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-white/80' : 'hover:bg-black/5 text-slate-800/80'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Section: Preferências */}
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 px-2 ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Preferências</h3>
              <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-200'}`}>
                
                <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-white/5' : 'border-slate-200/50'}`}>
                  <div className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Notificações Push</p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>Avisos e lembretes</p>
                    </div>
                  </div>
                  <Toggle active={notificationsEnabled} onToggle={toggleNotifications} />
                </div>

                <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-white/5' : 'border-slate-200/50'}`}>
                  <div className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-500">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">Modo {darkMode ? 'Escuro' : 'Claro'}</p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>Aparência do aplicativo</p>
                    </div>
                  </div>
                  <Toggle active={darkMode} onToggle={toggleDarkMode} />
                </div>

                 <div className="flex items-center justify-between p-4">
                  <div className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                      <Type className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Tamanho da Fonte</p>
                    </div>
                  </div>
                  <div className={`flex rounded-lg p-1 border ${darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-200 border-slate-300'}`}>
                    <button 
                        onClick={() => setFontSize('small')}
                        className={`px-2 py-1 text-xs rounded ${fontSize === 'small' ? (darkMode ? 'bg-white/20 text-white' : 'bg-white text-slate-900 shadow-sm') : (darkMode ? 'text-white/40' : 'text-slate-500')}`}>A</button>
                    <button 
                        onClick={() => setFontSize('medium')}
                        className={`px-2 py-1 text-sm rounded ${fontSize === 'medium' ? (darkMode ? 'bg-white/20 text-white' : 'bg-white text-slate-900 shadow-sm') : (darkMode ? 'text-white/40' : 'text-slate-500')}`}>A</button>
                    <button 
                        onClick={() => setFontSize('large')}
                        className={`px-2 py-1 text-base rounded ${fontSize === 'large' ? (darkMode ? 'bg-white/20 text-white' : 'bg-white text-slate-900 shadow-sm') : (darkMode ? 'text-white/40' : 'text-slate-500')}`}>A</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Sistema */}
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 px-2 ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>Sistema</h3>
              <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white/40 border-slate-200'}`}>
                 <button className={`w-full flex items-center justify-between p-4 border-b ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-200/50 hover:bg-white/50'} transition-colors text-left`}>
                  <div className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Privacidade e Dados</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/30' : 'text-slate-400'}`} />
                </button>
                
                <button className={`w-full flex items-center justify-between p-4 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-white/50'} transition-colors text-left`}>
                  <div className={`flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Sobre</p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>Versão 1.0.2 (Jubileu)</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/30' : 'text-slate-400'}`} />
                </button>
              </div>
            </div>

          </div>
          
          <div className="mt-8 text-center">
            <p className={`text-xs ${darkMode ? 'text-white/30' : 'text-slate-400'}`}>
              Agenda Paroquial © 2025<br/>Paróquia Nossa Senhora da Conceição
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default SettingsModal;