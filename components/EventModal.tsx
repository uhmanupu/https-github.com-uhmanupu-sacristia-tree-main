import React, { useState } from 'react';
import { X, Sparkles, Loader2, Clock, MapPin } from 'lucide-react';
import GlassCard from './GlassCard';
import { EventType, CalendarEvent } from '../types';
import { refineEventDetails } from '../services/geminiService';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EventType>(EventType.MASS);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('Igreja Matriz');
  const [celebrant, setCelebrant] = useState('Pe. João');
  const [aiLoading, setAiLoading] = useState(false);
  const [draftInput, setDraftInput] = useState('');

  if (!isOpen) return null;

  const handleAiAssist = async () => {
    if (!draftInput.trim()) return;
    setAiLoading(true);
    const suggestion = await refineEventDetails(draftInput);
    if (suggestion) {
      setTitle(suggestion.refinedTitle);
      setDescription(suggestion.refinedDescription);
      setType(suggestion.suggestedType);
    }
    setAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      date: selectedDate,
      startTime,
      endTime,
      type,
      location,
      celebrant
    });
    onClose();
    // Reset fields
    setTitle('');
    setDescription('');
    setDraftInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight font-solene uppercase">Novo Evento</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-6 h-6 text-white/80" />
            </button>
          </div>

          {/* AI Assistant Section */}
          <div className="mb-8 p-5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#FCD34D] mb-3">
              <Sparkles className="w-4 h-4" />
              Assistente de Jubileu
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={draftInput}
                onChange={(e) => setDraftInput(e.target.value)}
                placeholder="Ex: Missa de Sétimo dia amanhã às 19h"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#FCD34D]/30"
              />
              <button
                type="button"
                onClick={handleAiAssist}
                disabled={aiLoading || !draftInput}
                className="px-5 py-2.5 bg-[#FCD34D] hover:bg-[#FCD34D]/90 rounded-xl text-black font-black uppercase text-[10px] tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refinar'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-white/90">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-white/50">Título do Evento</label>
                  <input
                      required
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all font-solene uppercase tracking-wide"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-white/50">Tipo</label>
                  <select
                      value={type}
                      onChange={(e) => setType(e.target.value as EventType)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white/10 [&>option]:bg-zinc-900"
                  >
                      {Object.values(EventType).map(t => (
                      <option key={t} value={t}>{t}</option>
                      ))}
                  </select>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-white/50">Horário</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                          <Clock className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                          <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:bg-white/10"
                          />
                      </div>
                      <span className="opacity-30">até</span>
                      <div className="relative flex-1">
                          <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:bg-white/10"
                          />
                      </div>
                    </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1 text-white/50">Localização</label>
                  <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                      <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:bg-white/10"
                      />
                  </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-4 px-6 rounded-2xl bg-[#FCD34D] text-black font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl"
              >
                Salvar Evento
              </button>
            </div>
          </form>
        </div>
      </GlassCard>
    </div>
  );
};

export default EventModal;