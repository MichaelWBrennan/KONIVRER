import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AccessibilityIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wheelchair accessibility symbol */}
    {/* Head */}
    <circle cx="7" cy="4" r="2" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Body and arms */}
    <path d="M7 8 L7 12 L5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M7 10 L10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Wheelchair wheel */}
    <circle cx="7" cy="18" r="4" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="7" cy="18" r="1.5" fill={color} />
    
    {/* Wheelchair frame */}
    <path d="M7 12 L7 14 L11 14 L11 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M9 14 L9 12 L11 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    
    {/* Back wheel */}
    <circle cx="16" cy="17" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="17" r="1" fill={color} />
    
    {/* Connecting frame */}
    <path d="M11 14 L13 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SearchIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Crystal ball with mystical swirls */}
    <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Inner mystical patterns */}
    <circle cx="10" cy="10" r="4" stroke={color} strokeWidth="0.8" fill="none" opacity="0.6" />
    <path d="M6 10 Q10 6 14 10 Q10 14 6 10 Z" stroke={color} strokeWidth="0.5" fill="none" opacity="0.7" />
    
    {/* Mystical center dot */}
    <circle cx="10" cy="10" r="1" fill={color} opacity="0.9" />
    
    {/* Energy lines */}
    <path d="M7 7 L13 13" stroke={color} strokeWidth="0.5" opacity="0.5" />
    <path d="M13 7 L7 13" stroke={color} strokeWidth="0.5" opacity="0.5" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hooded figure with mystical aura */}
    <path d="M12 2 C8 2 5 5 5 9 L5 15 C5 19 8 22 12 22 C16 22 19 19 19 15 L19 9 C19 5 16 2 12 2 Z" 
          stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Hood */}
    <path d="M7 8 Q12 4 17 8 L17 12 Q12 8 7 12 Z" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    
    {/* Face area */}
    <circle cx="12" cy="13" r="2" fill={color} opacity="0.6" />
    
    {/* Mystical symbols around */}
    <circle cx="9" cy="7" r="0.5" fill={color} opacity="0.7" />
    <circle cx="15" cy="7" r="0.5" fill={color} opacity="0.7" />
    <circle cx="6" cy="12" r="0.5" fill={color} opacity="0.7" />
    <circle cx="18" cy="12" r="0.5" fill={color} opacity="0.7" />
  </svg>
);

export const MenuIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical grimoire/book with emanating energy */}
    <rect x="4" y="6" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M4 10 L20 10" stroke={color} strokeWidth="1" />
    
    {/* Book spine */}
    <path d="M4 6 L4 18" stroke={color} strokeWidth="2" />
    
    {/* Mystical runes/symbols */}
    <circle cx="8" cy="14" r="1" fill={color} opacity="0.7" />
    <circle cx="12" cy="14" r="1" fill={color} opacity="0.7" />
    <circle cx="16" cy="14" r="1" fill={color} opacity="0.7" />
    
    {/* Energy emanation */}
    <path d="M2 8 L4 6 L2 4" stroke={color} strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
    <path d="M22 8 L20 6 L22 4" stroke={color} strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
    <path d="M2 20 L4 18 L2 16" stroke={color} strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
    <path d="M22 20 L20 18 L22 16" stroke={color} strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
  </svg>
);

export const HomeIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical temple/sanctuary */}
    <path d="M3 9 L12 2 L21 9 L21 20 C21 20.5 20.5 21 20 21 L4 21 C3.5 21 3 20.5 3 20 L3 9 Z" 
          stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Temple pillars */}
    <path d="M6 21 L6 12" stroke={color} strokeWidth="1" />
    <path d="M18 21 L18 12" stroke={color} strokeWidth="1" />
    
    {/* Sacred geometry roof */}
    <path d="M12 2 L12 8" stroke={color} strokeWidth="1" opacity="0.8" />
    <circle cx="12" cy="8" r="2" stroke={color} strokeWidth="0.8" fill="none" opacity="0.6" />
    
    {/* Mystical doorway */}
    <path d="M9 21 L9 15 C9 14 10 13 11 13 L13 13 C14 13 15 14 15 15 L15 21" 
          stroke={color} strokeWidth="1.2" fill="none" />
    <circle cx="12" cy="17" r="0.5" fill={color} />
  </svg>
);

export const CardSearchIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical tarot card with arcane symbols */}
    <rect x="4" y="2" width="12" height="18" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Inner mystical pattern */}
    <circle cx="10" cy="8" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    
    {/* Arcane symbols */}
    <path d="M7 14 L13 14" stroke={color} strokeWidth="0.8" opacity="0.6" />
    <path d="M8 16 L12 16" stroke={color} strokeWidth="0.8" opacity="0.6" />
    
    {/* Mystical corners */}
    <circle cx="6" cy="4" r="0.5" fill={color} opacity="0.8" />
    <circle cx="14" cy="4" r="0.5" fill={color} opacity="0.8" />
    <circle cx="6" cy="18" r="0.5" fill={color} opacity="0.8" />
    <circle cx="14" cy="18" r="0.5" fill={color} opacity="0.8" />
    
    {/* Central mystical eye */}
    <circle cx="10" cy="8" r="1" fill={color} opacity="0.9" />
    
    {/* Energy emanation */}
    <path d="M17 15 Q20 18 22 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
  </svg>
);

export const DeckSearchIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stack of mystical scrolls/grimoires */}
    <rect x="3" y="8" width="14" height="2" rx="1" stroke={color} strokeWidth="1" fill="none" opacity="0.9" />
    <rect x="3" y="11" width="14" height="2" rx="1" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    <rect x="3" y="14" width="14" height="2" rx="1" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    
    {/* Main tome */}
    <rect x="4" y="4" width="13" height="3" rx="1.5" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Mystical binding */}
    <path d="M4 5.5 L17 5.5" stroke={color} strokeWidth="0.8" />
    
    {/* Arcane symbols on covers */}
    <circle cx="7" cy="5.5" r="0.5" fill={color} opacity="0.8" />
    <circle cx="10.5" cy="5.5" r="0.5" fill={color} opacity="0.8" />
    <circle cx="14" cy="5.5" r="0.5" fill={color} opacity="0.8" />
    
    {/* Mystical search energy */}
    <circle cx="18" cy="18" r="3" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7" />
    <path d="M20.5 20.5 L22 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="18" r="1" fill={color} opacity="0.6" />
  </svg>
);

export const MyDecksIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Personal mystical collection/altar */}
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Inner sanctuary */}
    <rect x="4" y="8" width="16" height="8" rx="1" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    
    {/* Personal artifacts/crystals */}
    <circle cx="8" cy="12" r="1.5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
    <rect x="11" y="10.5" width="3" height="3" rx="0.5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
    <polygon points="16,14 17.5,10.5 18.5,14 16,14" stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
    
    {/* Personal energy/aura */}
    <path d="M12 6 Q8 2 4 6" stroke={color} strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
    <path d="M12 6 Q16 2 20 6" stroke={color} strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
    
    {/* Personal sigil in center */}
    <circle cx="12" cy="4" r="1" fill={color} opacity="0.9" />
  </svg>
);

export const SimulatorIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical gaming board/scrying surface */}
    <rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Sacred geometry grid */}
    <path d="M8 4 L8 20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M16 4 L16 20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M2 10 L22 10" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M2 14 L22 14" stroke={color} strokeWidth="0.5" opacity="0.6" />
    
    {/* Mystical gaming pieces */}
    <circle cx="6" cy="8" r="1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
    <circle cx="12" cy="12" r="1.5" stroke={color} strokeWidth="0.8" fill={color} opacity="0.6" />
    <circle cx="18" cy="16" r="1" stroke={color} strokeWidth="0.8" fill="none" opacity="0.8" />
    
    {/* Energy connections */}
    <path d="M6 8 Q12 6 12 12 Q18 14 18 16" stroke={color} strokeWidth="0.6" opacity="0.5" fill="none" />
    
    {/* Arcane corners */}
    <circle cx="4" cy="6" r="0.5" fill={color} opacity="0.7" />
    <circle cx="20" cy="6" r="0.5" fill={color} opacity="0.7" />
    <circle cx="4" cy="18" r="0.5" fill={color} opacity="0.7" />
    <circle cx="20" cy="18" r="0.5" fill={color} opacity="0.7" />
  </svg>
);

export const RulesIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Ancient scroll with mystical writings */}
    <path d="M6 3 C5 3 4 4 4 5 L4 19 C4 20 5 21 6 21 L18 21 C19 21 20 20 20 19 L20 5 C20 4 19 3 18 3 L6 3 Z" 
          stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Scroll binding */}
    <path d="M4 7 L20 7" stroke={color} strokeWidth="1" />
    
    {/* Ancient text lines */}
    <path d="M7 10 L17 10" stroke={color} strokeWidth="0.8" opacity="0.7" />
    <path d="M7 12 L15 12" stroke={color} strokeWidth="0.8" opacity="0.7" />
    <path d="M7 14 L17 14" stroke={color} strokeWidth="0.8" opacity="0.7" />
    <path d="M7 16 L13 16" stroke={color} strokeWidth="0.8" opacity="0.7" />
    
    {/* Mystical seal/emblem */}
    <circle cx="12" cy="5" r="1.5" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    <circle cx="12" cy="5" r="0.5" fill={color} opacity="0.9" />
    
    {/* Corner decorations */}
    <path d="M6 19 Q6 18 7 18" stroke={color} strokeWidth="0.6" opacity="0.6" strokeLinecap="round" />
    <path d="M18 19 Q18 18 17 18" stroke={color} strokeWidth="0.6" opacity="0.6" strokeLinecap="round" />
  </svg>
);

export const TournamentsIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical trophy with arcane energy */}
    <path d="M8 21 L16 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 17 L12 21" stroke={color} strokeWidth="1.5" />
    
    {/* Trophy cup */}
    <path d="M6 9 C6 5 8 3 12 3 C16 3 18 5 18 9 L18 13 C18 15 16 17 14 17 L10 17 C8 17 6 15 6 13 L6 9 Z" 
          stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Mystical handles */}
    <path d="M6 10 C4 10 3 9 3 8 C3 7 4 6 6 6" stroke={color} strokeWidth="1" fill="none" />
    <path d="M18 10 C20 10 21 9 21 8 C21 7 20 6 18 6" stroke={color} strokeWidth="1" fill="none" />
    
    {/* Arcane symbol in center */}
    <circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
    <path d="M10 8 L14 8 L12 12 Z" stroke={color} strokeWidth="0.8" fill={color} opacity="0.6" />
    
    {/* Energy emanation */}
    <path d="M12 3 Q8 1 12 0 Q16 1 12 3" stroke={color} strokeWidth="0.6" opacity="0.5" fill="none" />
    <circle cx="8" cy="2" r="0.5" fill={color} opacity="0.6" />
    <circle cx="16" cy="2" r="0.5" fill={color} opacity="0.6" />
  </svg>
);

export const SocialIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical circle of practitioners */}
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Three mystical figures forming a trinity */}
    <circle cx="12" cy="6" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    <circle cx="7" cy="16" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    <circle cx="17" cy="16" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
    
    {/* Energy connections */}
    <path d="M10 7 L8 14" stroke={color} strokeWidth="0.8" opacity="0.6" />
    <path d="M14 7 L16 14" stroke={color} strokeWidth="0.8" opacity="0.6" />
    <path d="M9 16 L15 16" stroke={color} strokeWidth="0.8" opacity="0.6" />
    
    {/* Central mystical node */}
    <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.7" />
    
    {/* Spiritual essence dots */}
    <circle cx="12" cy="6" r="0.5" fill={color} opacity="0.9" />
    <circle cx="7" cy="16" r="0.5" fill={color} opacity="0.9" />
    <circle cx="17" cy="16" r="0.5" fill={color} opacity="0.9" />
  </svg>
);

export const AnalyticsIcon: React.FC<IconProps>  : any : any : any = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mystical divination chart */}
    <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Sacred geometry grid */}
    <path d="M3 8 L21 8" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M3 12 L21 12" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M3 16 L21 16" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M8 4 L8 20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M13 4 L13 20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <path d="M18 4 L18 20" stroke={color} strokeWidth="0.5" opacity="0.6" />
    
    {/* Mystical data visualization - ascending energy bars */}
    <rect x="6" y="14" width="2" height="4" fill={color} opacity="0.7" />
    <rect x="11" y="10" width="2" height="8" fill={color} opacity="0.7" />
    <rect x="16" y="6" width="2" height="12" fill={color} opacity="0.7" />
    
    {/* Mystical connection lines */}
    <path d="M7 14 Q11 8 17 6" stroke={color} strokeWidth="1" opacity="0.5" fill="none" />
    
    {/* Sacred nodes */}
    <circle cx="7" cy="14" r="1" fill={color} opacity="0.9" />
    <circle cx="12" cy="10" r="1" fill={color} opacity="0.9" />
    <circle cx="17" cy="6" r="1" fill={color} opacity="0.9" />
    
    {/* Arcane corner symbols */}
    <circle cx="5" cy="6" r="0.5" fill={color} opacity="0.6" />
    <circle cx="19" cy="6" r="0.5" fill={color} opacity="0.6" />
  </svg>
);