import React, { useEffect, useState } from 'react';
import { BookOpen, Book, Music, ScrollText, AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';
import { LiturgyData } from '../types';
import { fetchDailyLiturgy } from '../services/geminiService';

interface LiturgyViewProps {
  date: Date;
  darkMode: boolean;
}

const LiturgyView: React.FC<LiturgyViewProps> = ({ date, darkMode }) => {
  const [liturgy, setLiturgy] = useState<LiturgyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLiturgy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDailyLiturgy(date);
      setLiturgy(data);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('Limite de consultas diárias excedido. Por favor, tente novamente em alguns instantes.');
      } else {
        setError('Não foi possível carregar a liturgia deste dia.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiturgy();
  }, [date]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 md:py-32">
        <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-[#FCD34D] animate-spin mb-4" />
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black opacity-30">Invocando a Palavra...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4 opacity-50" />
        <h3 className="text-white font-solene text-lg mb-2 uppercase tracking-wide">Ops! Algo deu errado</h3>
        <p className="text-white/60 text-sm mb-6 max-w-[280px]">{error}</p>
        <button 
          onClick={loadLiturgy}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FCD34D] transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!liturgy) {
    return (
      <div className="text-center py-20 opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Liturgia indisponível</p>
      </div>
    );
  }

  const ReadingSection = ({ title, content, icon: Icon }: { title: string, content: string, icon: any }) => (
    <div className="mb-8 md:mb-10 px-1">
      <div className="flex items-center gap-3 mb-3 md:mb-4 px-1">
        <Icon className="w-3.5 md:w-4 h-3.5 md:h-4" style={{ color: 'var(--lit-color)' }} />
        <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{title}</h3>
      </div>
      <GlassCard className="p-5 md:p-7" hoverEffect={false}>
        <p className="text-[15px] md:text-[17px] leading-relaxed font-serif text-justify text-white/90">
          <span className="text-2xl md:text-3xl font-solene mr-1" style={{ color: 'var(--lit-color)' }}>{content.charAt(0)}</span>
          {content.slice(1)}
        </p>
      </GlassCard>
    </div>
  );

  return (
    <div className="w-full">
      <header className="mb-8 md:mb-10 text-center px-4">
        <h2 className="font-solene text-base md:text-lg text-white/80 tracking-wide uppercase leading-tight mb-2">
          {liturgy.celebrationName}
        </h2>
        <div className="h-[1px] w-8 bg-white/20 mx-auto"></div>
      </header>

      <div className="space-y-4">
        <ReadingSection title="1ª Leitura" content={liturgy.firstReading} icon={Book} />
        
        <div className="mb-8 md:mb-10 px-1">
          <div className="flex items-center gap-3 mb-3 md:mb-4 px-1">
            <Music className="w-3.5 md:w-4 h-3.5 md:h-4" style={{ color: 'var(--lit-color)' }} />
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Salmo Responsorial</h3>
          </div>
          <GlassCard className="p-5 md:p-7" hoverEffect={false}>
            <p className="text-lg md:text-xl font-serif italic mb-5 md:mb-6 leading-tight border-l-2 pl-4 text-white" style={{ borderColor: 'var(--lit-color)' }}>
              {liturgy.psalm.split('\n')[0]}
            </p>
            <p className="text-[15px] md:text-[17px] leading-relaxed font-serif opacity-70 whitespace-pre-line italic">
              {liturgy.psalm.split('\n').slice(1).join('\n')}
            </p>
          </GlassCard>
        </div>

        {liturgy.secondReading && (
          <ReadingSection title="2ª Leitura" content={liturgy.secondReading} icon={ScrollText} />
        )}

        <ReadingSection title="Evangelho" content={liturgy.gospel} icon={BookOpen} />
        
        {liturgy.reflection && (
          <div className="mt-6 md:mt-8 p-6 border-t border-white/5 italic text-center">
            <p className="text-[13px] md:text-sm text-white/40 leading-relaxed font-serif">
              {liturgy.reflection}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiturgyView;