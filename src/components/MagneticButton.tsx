import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SPRING_VELVET } from '../utils/motionTransitions';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'sage' | 'gold' | 'glass' | 'rose';
  size?: 'sm' | 'md' | 'lg';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  href,
  target,
  rel,
  variant = 'sage',
  size = 'md',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.22;
    const y = (clientY - (top + height / 2)) * 0.22;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    sage: 'bg-[#3A5040] hover:bg-[#2D3E32] text-[#FDFBF7] shadow-[0_8px_30px_rgb(34,50,38,0.35)] hover:shadow-[0_12px_35px_rgb(34,50,38,0.5)] border border-[#526C58]/40',
    gold: 'bg-gradient-to-r from-[#D4AF37] to-[#B8972E] text-[#121C16] font-medium shadow-[0_8px_30px_rgb(212,175,55,0.25)] hover:shadow-[0_12px_35px_rgb(212,175,55,0.4)] border border-[#E7C85C]/40',
    glass: 'bg-[#18251E]/80 hover:bg-[#1E2D24] text-[#F3EFE6] backdrop-blur-md border border-[#F3EFE6]/15 hover:border-[#7A8B7B]/50 shadow-lg',
    rose: 'bg-[#D3B8AA] hover:bg-[#C2A394] text-[#121C16] font-medium shadow-[0_8px_30px_rgb(211,184,170,0.3)] border border-[#E8D4C8]/40',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-3.5 text-sm tracking-wide',
    lg: 'px-8 py-4 text-base tracking-wide',
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      transition={SPRING_VELVET}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-sans cursor-pointer transition-colors duration-400 select-none overflow-hidden group ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {/* Acabamento acetinado líquido */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2 font-medium">{children}</span>
    </motion.div>
  );

  if (href) {
    const computedRel = rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined);
    return (
      <a href={href} target={target} rel={computedRel} onClick={onClick} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block bg-transparent border-0 p-0 m-0 cursor-pointer">
      {content}
    </button>
  );
};
