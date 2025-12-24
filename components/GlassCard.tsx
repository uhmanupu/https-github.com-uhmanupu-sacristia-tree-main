import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = true,
  style,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        relative overflow-hidden
        glass-mirror
        rounded-[24px]
        transition-all duration-500
        ${className}
        ${hoverEffect ? 'hover:translate-y-[-2px] hover:border-white/20 hover:bg-white/[0.08]' : ''}
      `}
    >
      {/* Dynamic Glass Reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;