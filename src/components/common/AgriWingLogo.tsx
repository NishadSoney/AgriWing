/**
 * @file components/common/AgriWingLogo.tsx
 * @description High-definition vector logo component for AgriWing, featuring
 * glowing emerald and teal aerodynamic drone wings integrated with an agricultural leaf emblem.
 */

import React from 'react';

interface AgriWingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const AgriWingLogo: React.FC<AgriWingLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  glow = true
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl sm:text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center`}>
        {glow && (
          <div className="absolute inset-0 bg-emerald-500/30 blur-md rounded-xl pointer-events-none" />
        )}
        
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <defs>
            <linearGradient id="wingGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            
            <linearGradient id="wingGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="leafGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>

            <radialGradient id="crosshairGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Rounded Shield / Tile */}
          <rect width="100" height="100" rx="24" fill="#09131e" stroke="#1e293b" strokeWidth="2" />
          
          {/* Subtle Precision Targeting Reticle */}
          <circle cx="50" cy="30" r="16" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <circle cx="50" cy="30" r="8" stroke="#10b981" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="10" x2="50" y2="18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="50" y1="42" x2="50" y2="50" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="30" y1="30" x2="38" y2="30" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="62" y1="30" x2="70" y2="30" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <circle cx="50" cy="30" r="2.5" fill="#34d399" />

          {/* Aerodynamic Left Wing */}
          <path
            d="M 20 34 C 32 30, 42 42, 46 64 C 40 68, 30 58, 22 48 C 19 44, 18 38, 20 34 Z"
            fill="url(#wingGradLeft)"
          />
          <path
            d="M 12 42 C 24 38, 36 50, 38 72 C 32 74, 24 64, 16 54 C 13 50, 11 46, 12 42 Z"
            fill="url(#wingGradLeft)"
            opacity="0.8"
          />

          {/* Aerodynamic Right Wing */}
          <path
            d="M 80 34 C 68 30, 58 42, 54 64 C 60 68, 70 58, 78 48 C 81 44, 82 38, 80 34 Z"
            fill="url(#wingGradRight)"
          />
          <path
            d="M 88 42 C 76 38, 64 50, 62 72 C 68 74, 76 64, 84 54 C 87 50, 89 46, 88 42 Z"
            fill="url(#wingGradRight)"
            opacity="0.8"
          />

          {/* Central Stylized 'W' Base & Agricultural Sprout Leaf */}
          <path
            d="M 38 78 L 48 88 C 49 89, 51 89, 52 88 L 62 78 C 66 74, 58 68, 50 60 C 42 68, 34 74, 38 78 Z"
            fill="#059669"
            stroke="#34d399"
            strokeWidth="1.5"
          />

          {/* Glowing Central Leaf */}
          <path
            d="M 50 40 C 44 48, 44 62, 50 72 C 56 62, 56 48, 50 40 Z"
            fill="url(#leafGrad)"
          />
          <path
            d="M 50 42 L 50 70"
            stroke="#a7f3d0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 50 52 Q 46 50, 44 48"
            stroke="#a7f3d0"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M 50 58 Q 54 56, 56 54"
            stroke="#a7f3d0"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white ${currentSize.text}`}>
              Agri<span className="text-emerald-400">Wing</span>
            </span>
          </div>
          <span className={`font-mono font-medium text-slate-400 tracking-wider uppercase mt-1 ${currentSize.sub}`}>
            Precision Ag Technologies
          </span>
        </div>
      )}
    </div>
  );
};
