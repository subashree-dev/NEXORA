import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Deterministic subtle pastel palette for clean, distinct monogram initials
function getInitialsColor(name: string): { bg: string; text: string; border: string } {
  const palettes = [
    { bg: 'bg-blue-100/90', text: 'text-blue-800', border: 'border-blue-200/80' },
    { bg: 'bg-indigo-100/90', text: 'text-indigo-800', border: 'border-indigo-200/80' },
    { bg: 'bg-teal-100/90', text: 'text-teal-800', border: 'border-teal-200/80' },
    { bg: 'bg-slate-200/90', text: 'text-slate-800', border: 'border-slate-300/80' },
    { bg: 'bg-emerald-100/90', text: 'text-emerald-800', border: 'border-emerald-200/80' },
    { bg: 'bg-sky-100/90', text: 'text-sky-800', border: 'border-sky-200/80' },
    { bg: 'bg-violet-100/90', text: 'text-violet-800', border: 'border-violet-200/80' },
    { bg: 'bg-cyan-100/90', text: 'text-cyan-800', border: 'border-cyan-200/80' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'ST';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs font-semibold',
    lg: 'w-12 h-12 text-sm font-semibold',
    xl: 'w-14 h-14 text-base font-bold',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const color = getInitialsColor(name);

  if (!src || hasError) {
    return (
      <div
        className={`shrink-0 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center font-mono select-none border ${color.border} shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] ${currentSizeClass} ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`shrink-0 rounded-2xl object-cover border border-slate-200 bg-slate-100 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7)] ${currentSizeClass} ${className}`}
    />
  );
};
