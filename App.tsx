import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Clock,
  Cross,
  ChevronRight,
  Info
} from 'lucide-react';
import GlassCard from './components/GlassCard';
import LiturgyView from './components/LiturgyView';
import NotificationToast, { ToastMessage } from './components/NotificationToast';
import { CalendarEvent, EventType, ParishAnnouncement } from './types';

type Tab = 'agenda' | 'liturgia' | 'avisos';

interface LitDay {
  title: string;
  color: 'roxo' | 'branco' | 'vermelho';
}

const LITURGY_MAP: Record<string, LitDay> = {
  // Dezembro (mês 11 no JS)
  '2025-11-16': { title: '3ª Semana do Advento', color: 'roxo' },
  '2025-11-17': { title: '3ª Semana do Advento', color: 'roxo' },
  '2025-11-18': { title: '3ª Semana do Advento', color: 'roxo' },
  '2025-11-19': { title: '3ª Semana do Advento', color: 'roxo' },
  '2025-11-20': { title: '3ª Semana do Advento', color: 'roxo' },
  '2025-11-21': { title: '4º Domingo do Advento', color: 'roxo' },
  '2025-11-22': { title: '4ª Semana do Advento', color: 'roxo' },
  '2025-11-23': { title: '4ª Semana do Advento', color: 'roxo' },
  '2025-11-24': { title: 'Véspera de Natal', color: 'branco' },
  '2025-11-25': { title: 'Natal do Senhor', color: 'branco' },
  '2025-11-26': { title: 'Santo Estêvão (Mártir)', color: 'vermelho' },
  '2025-11-27': { title: 'São João Evangelista', color: 'branco' },
  '2025-11-28': { title: 'Sagrada Família', color: 'branco' },
  '2025-11-29': { title: '5º Dia da Oitava de Natal', color: 'branco' },
  '2025-11-30': { title: '6º Dia da Oitava de Natal', color: 'branco' },
  '2025-11-31': { title: '7º Dia da Oitava de Natal', color: 'branco' },
  // Janeiro (mês 0 no JS)
  '2026-0-1': { title: 'Solenidade de Santa Maria, Mãe de Deus', color: 'branco' },
  '2026-0-2': { title: 'Ss. Basílio Magno e Gregório Nazianzeno', color: 'branco' },
};

const INITIAL_EVENTS: CalendarEvent[] = [
  // 16/12
  { id: '16-1', title: 'Confissões crismandos', description: '', date: new Date(2025, 11, 16), startTime: '09:00', endTime: '', type: EventType.CONFESSION, location: 'Matriz' },
  { id: '16-2', title: 'Atendimento (com hora marcada)', description: '', date: new Date(2025, 11, 16), startTime: '14:00', endTime: '', type: EventType.MEETING, location: 'Secretaria' },
  { id: '16-3', title: 'Confissões crismandos', description: '', date: new Date(2025, 11, 16), startTime: '14:00', endTime: '', type: EventType.CONFESSION, location: 'Matriz' },
  { id: '16-4', title: 'Santa Missa Setor 1', description: '', date: new Date(2025, 11, 16), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Bairro Mendes' },
  { id: '16-5', title: 'Formação MESC', description: '', date: new Date(2025, 11, 16), startTime: '19:00', endTime: '', type: EventType.MEETING, location: 'Centro Pastoral' },
  // 17/12
  { id: '17-1', title: 'Atendimento (com hora marcada)', description: '', date: new Date(2025, 11, 17), startTime: '09:00', endTime: '', type: EventType.MEETING, location: 'Secretaria' },
  { id: '17-2', title: 'Confissões crismandos', description: '', date: new Date(2025, 11, 17), startTime: '09:00', endTime: '', type: EventType.CONFESSION, location: 'Matriz' },
  { id: '17-3', title: 'Confissões crismandos', description: '', date: new Date(2025, 11, 17), startTime: '14:00', endTime: '', type: EventType.CONFESSION, location: 'Matriz' },
  { id: '17-4', title: 'Santa Missa Setor 7 (Formatura)', description: '', date: new Date(2025, 11, 17), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Bairro Serra Verde' },
  { id: '17-5', title: 'Reunião CPP e Festa de São Sebastião', description: '', date: new Date(2025, 11, 17), startTime: '19:00', endTime: '', type: EventType.MEETING, location: 'Salão Paroquial' },
  // 18/12
  { id: '18-1', title: 'Atendimento (com hora marcada)', description: '', date: new Date(2025, 11, 18), startTime: '09:00', endTime: '', type: EventType.MEETING, location: 'Secretaria' },
  { id: '18-2', title: 'Confissões crismandos', description: '', date: new Date(2025, 11, 18), startTime: '09:00', endTime: '', type: EventType.CONFESSION, location: 'Matriz' },
  { id: '18-3', title: 'Confissões crismandos', description: '', date: new Date(2025, 11, 18), startTime: '14:00', endTime: '', type: EventType.CONFESSION, location: 'Matriz' },
  { id: '18-4', title: 'Confissões', description: '', date: new Date(2025, 11, 18), startTime: '17:00', endTime: '', type: EventType.CONFESSION, location: 'Igreja Matriz' },
  { id: '18-5', title: 'Adoração', description: '', date: new Date(2025, 11, 18), startTime: '18:00', endTime: '', type: EventType.OTHER, location: 'Igreja Matriz' },
  { id: '18-6', title: 'Santa Missa', description: '', date: new Date(2025, 11, 18), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  { id: '18-7', title: 'Santa Missa Setor 1', description: '', date: new Date(2025, 11, 18), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Bairro Muquém' },
  // 19/12
  { id: '19-1', title: 'Visita às obras', description: '', date: new Date(2025, 11, 19), startTime: '09:00', endTime: '', type: EventType.OTHER, location: 'Canteiro' },
  { id: '19-2', title: 'Santa Missa', description: '', date: new Date(2025, 11, 19), startTime: '09:00', endTime: '', type: EventType.MASS, location: 'Abrigo São Camilo' },
  { id: '19-3', title: 'Atendimento (com hora marcada)', description: '', date: new Date(2025, 11, 19), startTime: '14:00', endTime: '', type: EventType.MEETING, location: 'Secretaria' },
  { id: '19-4', title: 'Santa Missa Setor 2', description: '', date: new Date(2025, 11, 19), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Bairro Porto' },
  { id: '19-5', title: 'Santa Missa Setor 5', description: '', date: new Date(2025, 11, 19), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Bairro Pouso Frio' },
  // 20/12
  { id: '20-1', title: 'Crismas', description: '', date: new Date(2025, 11, 20), startTime: '10:00', endTime: '', type: EventType.OTHER, location: 'Igreja Matriz' },
  { id: '20-2', title: 'Santa Missa Setor 1', description: '', date: new Date(2025, 11, 20), startTime: '10:00', endTime: '', type: EventType.MASS, location: 'Bairro Virgem do Socorro' },
  { id: '20-3', title: 'Santa Missa', description: '', date: new Date(2025, 11, 20), startTime: '16:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  { id: '20-4', title: 'Santa Missa', description: '', date: new Date(2025, 11, 20), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  // 21/12
  { id: '21-1', title: 'Santa Missa', description: '', date: new Date(2025, 11, 21), startTime: '07:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  { id: '21-2', title: 'Santa Missa', description: '', date: new Date(2025, 11, 21), startTime: '09:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  { id: '21-3', title: 'Santa Missa Setor 7', description: '', date: new Date(2025, 11, 21), startTime: '10:00', endTime: '', type: EventType.MASS, location: 'Bairro Retiro dos Marins' },
  { id: '21-4', title: 'Santa Missa Setor 1', description: '', date: new Date(2025, 11, 21), startTime: '11:00', endTime: '', type: EventType.MASS, location: 'Bairro Retirinho' },
  { id: '21-5', title: 'Santa Missa Setor 4', description: '', date: new Date(2025, 11, 21), startTime: '18:00', endTime: '', type: EventType.MASS, location: 'Bairro Moreiras' },
  { id: '21-6', title: 'Santa Missa', description: '', date: new Date(2025, 11, 21), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  // 24/12
  { id: '24-1', title: 'Santa Missa', description: '', date: new Date(2025, 11, 24), startTime: '17:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  { id: '24-2', title: 'Santa Missa Setor 6', description: '', date: new Date(2025, 11, 24), startTime: '19:00', endTime: '', type: EventType.MASS, location: 'Bairro São José da Mantiqueira' },
  { id: '24-3', title: 'Santa Missa', description: '', date: new Date(2025, 11, 24), startTime: '20:00', endTime: '', type: EventType.MASS, location: 'Igreja Matriz' },
  { id: '24-4', title: 'Santa Missa Setor 7', description: '', date: new Date(2025, 11, 24), startTime: '21:00', endTime: '', type: EventType.MASS, location: 'Bairro Roseirinha' },
];

const INITIAL_ANNOUNCEMENTS: ParishAnnouncement[] = [
  { id: 'a1', title: 'Jubileu 160 Anos', content: 'Abertura das celebrações oficiais no próximo domingo com a presença do Bispo Diocesano.', date: '2025-11-21', priority: 'alta' },
  { id: 'a2', title: 'Inscrições Catequese', content: 'Inscrições abertas na secretaria paroquial para as turmas de 2026.', date: '2025-11-15', priority: 'media' },
  { id: 'a3', title: 'Reforma da Matriz', content: 'Agradecemos as doações para a pintura da fachada. Campanha continua este mês.', date: '2025-11-10', priority: 'baixa' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('agenda');
  const [selDate, setSelDate] = useState(new Date());
  const [showSplash, setShowSplash] = useState(true);
  const [isExitingSplash, setIsExitingSplash] = useState(false);
  const [events] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [announcements] = useState<ParishAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<ToastMessage[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    const t = setTimeout(() => {
      setIsExitingSplash(true);
      setTimeout(() => setShowSplash(false), 800);
    }, 2000); 
    return () => clearTimeout(t);
  }, []);

  const centralizeDate = (target?: HTMLElement) => {
    const el = target || scrollRef.current?.querySelector('[data-active="true"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (!showSplash) {
      setTimeout(centralizeDate, 100);
    }
  }, [showSplash]);

  const litData = LITURGY_MAP[`${selDate.getFullYear()}-${selDate.getMonth()}-${selDate.getDate()}`] || { title: 'Tempo Comum', color: 'branco' };
  
  const colorHex = {
    roxo: '#C084FC',
    branco: '#FCD34D',
    vermelho: '#F87171'
  }[litData.color];

  const colorSoft = {
    roxo: 'rgba(192, 132, 252, 0.15)',
    branco: 'rgba(252, 211, 77, 0.15)',
    vermelho: 'rgba(248, 113, 113, 0.15)'
  }[litData.color];

  useEffect(() => {
    document.documentElement.style.setProperty('--lit-color', colorHex);
    document.documentElement.style.setProperty('--lit-color-soft', colorSoft);
  }, [colorHex]);

  const days = Array.from({length: 60}, (_, i) => {
    const today = new Date();
    const d = new Date(today);
    d.setDate(today.getDate() - 15 + i);
    return d;
  });

  const currentEvents = events.filter(e => e.date.toDateString() === selDate.toDateString()).sort((a,b) => a.startTime.localeCompare(b.startTime));

  const handleDateClick = (date: Date, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelDate(date);
    setSelectedEventId(null); // Limpa seleção de evento ao mudar data
    centralizeDate(e.currentTarget);
  };

  const handleEventClick = (id: string) => {
    setSelectedEventId(id === selectedEventId ? null : id);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTabTranslate = () => {
    if (activeTab === 'agenda') return '0%';
    if (activeTab === 'liturgia') return '-33.33%';
    return '-66.66%';
  };

  if (showSplash) {
    return (
      <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-1000 ${isExitingSplash ? 'opacity-0 scale-105 blur-2xl' : ''}`}>
        <div className="animate-halo-pulse w-[500px] h-[500px] rounded-full bg-[#FCD34D] opacity-20 blur-[100px]" />
        <div className="relative z-10 flex flex-col items-center px-6">
          <p className="font-sans text-[10px] md:text-xs font-black tracking-[0.5em] uppercase text-[#FCD34D] mb-4 opacity-70">Jubileu 160 anos</p>
          <h1 className="font-solene text-4xl md:text-7xl text-[#FCD34D] tracking-tight mb-6 text-center leading-tight">Agenda Paroquial</h1>
          <div className="flex items-center gap-4 md:gap-6 opacity-30">
            <div className="h-[1px] w-10 md:w-16 bg-white" />
            <p className="font-sans text-[11px] md:text-[13px] font-bold tracking-[0.8em] md:tracking-[1em] text-white">1866 - 2026</p>
            <div className="h-[1px] w-10 md:w-16 bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-x-hidden">
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} darkMode={true} />
      
      <nav className="fixed top-0 left-0 right-0 z-40 glass-mirror border-b border-white/5 py-4 px-6 flex items-center justify-center safe-top h-16">
        <div className="flex flex-col items-center">
          <h2 className="font-solene text-[12px] md:text-sm font-bold text-[#FCD34D] tracking-wide uppercase">Paróquia Nossa Senhora da Conceição</h2>
          <p className="font-sans text-[8px] font-black tracking-[0.3em] uppercase opacity-40 text-white mt-0.5">Virgínia-MG</p>
        </div>
      </nav>

      <div 
        className="fixed top-0 w-[150vw] h-[150vw] rounded-full opacity-10 blur-[150px] pointer-events-none transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" 
        style={{ 
          backgroundColor: colorHex,
          transform: activeTab === 'agenda' ? 'translate(-20%, -30%)' : (activeTab === 'liturgia' ? 'translate(0%, -20%)' : 'translate(-10%, -40%)')
        }} 
      />

      <header className={`pt-24 pb-4 px-6 text-center z-10 shrink-0 transition-all duration-500 ${activeTab === 'avisos' ? 'opacity-0 h-0 overflow-hidden pt-0 pb-0 mb-0' : 'opacity-100 mb-2'}`}>
        <p className="font-sans text-[9px] md:text-[11px] font-black tracking-[0.4em] uppercase mb-1 opacity-50">
          {selDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="font-solene text-3xl md:text-5xl text-white leading-tight tracking-tight uppercase mb-1">
          {selDate.toDateString() === new Date().toDateString() ? 'Hoje' : selDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
        </h1>
        <div className="flex justify-center items-center gap-3">
          <div className="h-[1px] w-4 opacity-20 bg-white" />
          <p className="font-sans text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-black" style={{ color: colorHex }}>
              {litData.title}
          </p>
          <div className="h-[1px] w-4 opacity-20 bg-white" />
        </div>
      </header>

      <div className={`px-4 mb-6 z-10 shrink-0 transition-all duration-500 ${activeTab === 'avisos' ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
        <div 
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x pb-2 scroll-smooth"
        >
          {days.map((date) => {
            const active = date.toDateString() === selDate.toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={(e) => handleDateClick(date, e)}
                data-active={active}
                className={`flex-shrink-0 w-12 md:w-14 h-16 md:h-20 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center snap-center active:scale-95 ${
                  active ? 'border-white bg-white text-black scale-105 shadow-xl' : 'bg-zinc-900/40 border-white/5 text-white/30'
                }`}
              >
                <span className="text-[8px] md:text-[9px] font-bold uppercase mb-0.5 md:mb-1">{date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                <span className="text-lg md:text-xl font-black leading-none">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <header className={`pt-24 pb-4 px-6 text-center z-10 shrink-0 transition-all duration-500 ${activeTab !== 'avisos' ? 'opacity-0 h-0 overflow-hidden pt-0 pb-0' : 'opacity-100 mb-4'}`}>
        <p className="font-sans text-[9px] md:text-[11px] font-black tracking-[0.4em] uppercase mb-1 opacity-50">Comunicados Gerais</p>
        <h1 className="font-solene text-3xl md:text-5xl text-white leading-tight tracking-tight uppercase mb-1">Mural Paroquial</h1>
        <div className="flex justify-center items-center gap-3">
          <div className="h-[1px] w-4 opacity-20 bg-white" />
          <p className="font-sans text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-black text-[#FCD34D]">Fique por dentro</p>
          <div className="h-[1px] w-4 opacity-20 bg-white" />
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <div 
          className="view-container h-full"
          style={{ width: '300vw', transform: `translateX(${getTabTranslate()})` }}
        >
          <div className="view-panel" style={{ width: '100vw' }}>
            <div className="max-w-md mx-auto space-y-4 px-6 pb-40" key={`agenda-${selDate.toDateString()}`}>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, i) => {
                  const isSelected = selectedEventId === event.id;
                  return (
                    <div key={event.id} className="stagger-item" style={{ animationDelay: `${i * 0.08}s` }}>
                      <GlassCard 
                        onClick={() => handleEventClick(event.id)}
                        className={`p-4 md:p-6 border-l-4 cursor-pointer transition-all duration-300 ${isSelected ? 'scale-[1.03] border-white/30 ring-1 ring-white/10' : ''}`}
                        style={{ 
                          borderLeftColor: colorHex,
                          boxShadow: isSelected ? `0 10px 40px -10px ${colorSoft}` : 'none'
                        }}
                      >
                        <div className="flex items-start gap-4 md:gap-6">
                          <div className="flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px]">
                            <span className="text-base md:text-xl font-black tracking-tighter" style={{ color: colorHex }}>{event.startTime}</span>
                            <Clock className="w-3 md:w-3.5 h-3 md:h-3.5 opacity-20 mt-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-1.5" style={{ backgroundColor: colorSoft, color: colorHex }}>{event.type}</span>
                            <h3 className="font-solene text-sm md:text-lg font-bold text-white mb-1 md:mb-2 uppercase leading-snug tracking-wide truncate">{event.title}</h3>
                            <div className="flex items-center gap-1.5 opacity-50 text-[10px] md:text-[11px] font-semibold">
                              <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 md:py-32 opacity-10 flex flex-col items-center stagger-item">
                  <Cross className="w-10 md:w-12 h-10 md:h-12 mb-4" />
                  <p className="font-solene text-xs uppercase tracking-[0.4em]">Silêncio de Oração</p>
                </div>
              )}
            </div>
          </div>

          <div className="view-panel" style={{ width: '100vw' }}>
             <div className="max-w-md mx-auto px-6 pb-40 stagger-item" key={`liturgia-${selDate.toDateString()}`}>
                <LiturgyView date={selDate} darkMode={true} />
             </div>
          </div>

          <div className="view-panel" style={{ width: '100vw' }}>
            <div className="max-w-md mx-auto space-y-4 px-6 pb-40">
              {announcements.map((ann, i) => (
                <div key={ann.id} className="stagger-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GlassCard className={`p-6 border-t-2 ${ann.priority === 'alta' ? 'border-t-red-500' : (ann.priority === 'media' ? 'border-t-yellow-500' : 'border-t-blue-500')}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${ann.priority === 'alta' ? 'bg-red-500' : (ann.priority === 'media' ? 'bg-yellow-500' : 'bg-blue-500')}`} />
                         <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{new Date(ann.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <h3 className="font-solene text-lg font-bold text-white mb-3 uppercase tracking-wide leading-tight">{ann.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed font-sans">{ann.content}</p>
                    <button className="mt-4 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#FCD34D] hover:opacity-80 transition-opacity">
                      Saiba Mais <ChevronRight className="w-3 h-3" />
                    </button>
                  </GlassCard>
                </div>
              ))}
              <div className="py-10 text-center opacity-20">
                <Info className="w-8 h-8 mx-auto mb-2" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Fim dos avisos recentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-1.5 rounded-[22px] glass-mirror border-white/10 flex items-center shadow-[0_15px_40px_rgba(0,0,0,0.6)] w-[85%] max-w-[380px] pointer-events-auto overflow-hidden">
        <div 
          className="active-tab-bg" 
          style={{ 
            width: 'calc(33.33% - 6px)',
            height: 'calc(100% - 8px)',
            borderRadius: '16px',
            transform: activeTab === 'agenda' ? 'translateX(3px)' : (activeTab === 'liturgia' ? 'translateX(calc(100% + 3px))' : 'translateX(calc(200% + 3px))')
          }} 
        />
        <button 
          onClick={() => setActiveTab('agenda')}
          className={`flex-1 py-3 flex items-center justify-center relative z-10 transition-colors duration-500 font-black text-[10px] uppercase tracking-[0.2em] ${activeTab === 'agenda' ? 'text-black' : 'text-white/40'}`}
        >
          <span>Agenda</span>
        </button>
        <button 
          onClick={() => setActiveTab('liturgia')}
          className={`flex-1 py-3 flex items-center justify-center relative z-10 transition-colors duration-500 font-black text-[10px] uppercase tracking-[0.2em] ${activeTab === 'liturgia' ? 'text-black' : 'text-white/40'}`}
        >
          <span>Liturgia</span>
        </button>
        <button 
          onClick={() => setActiveTab('avisos')}
          className={`flex-1 py-3 flex items-center justify-center relative z-10 transition-colors duration-500 font-black text-[10px] uppercase tracking-[0.2em] ${activeTab === 'avisos' ? 'text-black' : 'text-white/40'}`}
        >
          <span>Avisos</span>
        </button>
      </nav>

      <footer className="fixed bottom-2 left-0 right-0 text-center z-10 opacity-10 pointer-events-none">
        <p className="text-[7px] font-black uppercase tracking-[0.5em]">Jubileu 160 Anos</p>
      </footer>
    </div>
  );
};

export default App;