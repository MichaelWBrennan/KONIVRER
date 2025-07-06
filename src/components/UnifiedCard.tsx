import React from 'react';
/**
 * KONIVRER Unified Card Component
 * 
 * A unified card component that combines functionality from:
 * - Card
 * - GameCard
 * - KonivrERCard
 * - CardPreview
 * 
 * Features:
 * - Multiple display variants
 * - Interactive card preview
 * - Support for all card types and zones
 * - Animations and visual effects
 * - Responsive design
 * 
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Import element and keyword systems
import { ELEMENT_SYMBOLS } from '../engine/elementalSystem';
import { KEYWORD_SYMBOLS, getKeywordDisplayInfo } from '../engine/keywordSystem';

// Import styles
import '../styles/card.css';
import '../styles/cardPreview.css';

// Import icons
import { 
  Flame, 
  Droplets, 
  Mountain, 
  Wind, 
  Sparkles, 
  Square, 
  Circle,
  Shield,
  Sword,
  Star,
  Zap,
  Crown,
  Eye,
  Clock,
  Info,
  X,
  Maximize2,
  AlertCircle,
  Heart,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';

// Unified interface for all card variants
interface UnifiedCardProps {
  // Common props
  card: any;
  onClick?: (e: React.MouseEvent, card: any) => void;
  onHover?: (card: any | null) => void;
  
  // Display options
  variant?: 'standard' | 'game' | 'konivrer' | 'preview';
  size?: 'tiny' | 'small' | 'normal' | 'large';
  faceDown?: boolean;
  showDetails?: boolean;
  
  // Game state
  zone?: string;
  isSelected?: boolean;
  isTargeted?: boolean;
  isInteractive?: boolean;
  targetMode?: boolean;
  
  // Preview options
  previewPosition?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  
  // Additional props
  onDragStart?: (e: React.DragEvent, card: any) => void;
  onClose?: () => void;
  className?: string;
}

const UnifiedCard: React.FC<UnifiedCardProps> = ({
  // Default props
  card,
  onClick,
  onHover,
  variant = 'standard',
  size = 'normal',
  faceDown = false,
  showDetails = false,
  zone = 'hand',
  isSelected = false,
  isTargeted = false,
  isInteractive = true,
  targetMode = false,
  previewPosition = 'right',
  onDragStart,
  onClose,
  className = ''
}) => {
  // State
  const [showPreview, setShowPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCardDetails, setShowCardDetails] = useState(showDetails);
  
  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Detect if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If there's an onClick handler passed as prop, use that
    if (onClick && isInteractive) {
      onClick(e, card);
      return;
    }
    
    // Otherwise, show the card preview
    if (isInteractive && !faceDown) {
      setShowPreview(true);
    }
  };
  
  // Handle card hover
  const handleCardHover = (isHovering: boolean) => {
    if (onHover && isInteractive && !faceDown) {
      onHover(isHovering ? card : null);
    }
  };
  
  // Handle card drag start
  const handleCardDragStart = (e: React.DragEvent) => {
    if (onDragStart && isInteractive && !faceDown) {
      onDragStart(e, card);
    }
  };
  
  // Handle close preview
  const handleClosePreview = () => {
    setShowPreview(false);
    setExpanded(false);
  };
  
  // Handle 3D card rotation effect
  useEffect(() => {
    if (!expanded || !cardRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to card
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position
      const rotateY = ((x / rect.width) - 0.5) * 20; // -10 to 10 degrees
      const rotateX = ((y / rect.height) - 0.5) * -20; // 10 to -10 degrees
      
      setRotation({ x: rotateX, y: rotateY });
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [expanded]);
  
  // If no card data, return null
  if (!card) return null;
  
  // Determine if card is a valid target in target mode
  const isValidTarget = targetMode && card.isValidTarget;
  
  // Get element icons
  const getElementIcon = (element: string) => {
    switch (element.toLowerCase()) {
      case 'fire':
        return <Flame size={16} className="text-red-500" />;
      case 'water':
        return <Droplets size={16} className="text-blue-500" />;
      case 'earth':
        return <Mountain size={16} className="text-green-500" />;
      case 'air':
        return <Wind size={16} className="text-yellow-500" />;
      case 'light':
        return <Sparkles size={16} className="text-white" />;
      case 'dark':
        return <Square size={16} className="text-purple-500" />;
      default:
        return <Circle size={16} className="text-gray-500" />;
    }
  };
  
  // Render face-down card
  const renderFaceDownCard = () => {
    const sizeClasses = {
      tiny: 'w-12 h-16',
      small: 'w-16 h-24',
      normal: 'w-24 h-32',
      large: 'w-32 h-48'
    };
    
    return (
      <div 
        className={`card face-down ${sizeClasses[size]} ${className}`}
        onClick={handleCardClick}
      >
        <img src="/assets/card-back-new.png" alt="Card Back" />
      </div>
    );
  };
  
  // Render standard card
  const renderStandardCard = () => {
    const sizeClasses = {
      tiny: 'w-12 h-16',
      small: 'w-16 h-24',
      normal: 'w-24 h-32',
      large: 'w-32 h-48'
    };
    
    // For Azoth cards
    if (card.type === 'Azoth') {
      return (
        <>
          <div 
            className={`card azoth ${card.rested ? 'rested' : ''} ${sizeClasses[size]} ${className}`}
            onClick={handleCardClick}
            onMouseEnter={() => handleCardHover(true)}
            onMouseLeave={() => handleCardHover(false)}
            draggable={isInteractive}
            onDragStart={handleCardDragStart}
          >
            <div className="card-name">{card.name}</div>
            <div className="card-type">{card.type}</div>
            <div className="azoth-value">{card.value}</div>
          </div>
          
          {showPreview && (
            <div className="card-preview-overlay" onClick={handleClosePreview}>
              <div className="card-preview-container" onClick={(e) => e.stopPropagation()}>
                <div className="card-preview azoth">
                  <div className="card-preview-header">
                    <div className="card-preview-name">{card.name}</div>
                    <div className="card-preview-type">{card.type}</div>
                  </div>
                  
                  <div className="card-preview-image">
                    <div className="azoth-symbol">{card.value}</div>
                  </div>
                  
                  <div className="card-preview-abilities">
                    {card.abilities && card.abilities.map((ability, index) => (
                      <div key={index} className="card-preview-ability">
                        {ability.effect}
                      </div>
                    ))}
                  </div>
                  
                  <div className="card-preview-flavor">
                    {card.flavor}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
    
    // For regular cards
    return (
      <>
        <div 
          className={`card ${card.type.toLowerCase()} ${card.rested ? 'rested' : ''} ${sizeClasses[size]} ${className}`}
          onClick={handleCardClick}
          onMouseEnter={() => handleCardHover(true)}
          onMouseLeave={() => handleCardHover(false)}
          draggable={isInteractive}
          onDragStart={handleCardDragStart}
        >
          <div className="card-name">{card.name}</div>
          <div className="card-type">{card.type}</div>
          
          {card.type === 'Familiar' && (
            <div className="card-stats">
              <div className="card-strength">{card.strength}</div>
              <div className="card-health">{card.health}</div>
            </div>
          )}
          
          {/* Element costs */}
          <div className="card-elements">
            {Object.entries(card.elements || {}).map(([element, count]) => (
              count > 0 && (
                <div key={element} className={`element-cost ${element}`}>
                  {ELEMENT_SYMBOLS[element]} {count}
                </div>
              )
            ))}
          </div>
        </div>
        
        {showPreview && (
          <div className="card-preview-overlay" onClick={handleClosePreview}>
            <div className="card-preview-container" onClick={(e) => e.stopPropagation()}>
              <div className={`card-preview ${card.type.toLowerCase()}`}>
                <div className="card-preview-header">
                  <div className="card-preview-name">{card.name}</div>
                  <div className="card-preview-type">{card.type}</div>
                </div>
                
                <div className="card-preview-image">
                  <div className="card-preview-image-placeholder">
                    {card.type === 'Familiar' && (
                      <div className="familiar-symbol">⚔</div>
                    )}
                    {card.type === 'Spell' && (
                      <div className="spell-symbol">✧</div>
                    )}
                    {card.type === 'Flag' && (
                      <div className="flag-symbol">⚑</div>
                    )}
                  </div>
                </div>
                
                <div className="card-preview-elements">
                  {Object.entries(card.elements || {}).map(([element, count]) => (
                    count > 0 && (
                      <div key={element} className={`element-cost ${element}`}>
                        {ELEMENT_SYMBOLS[element]} {count}
                      </div>
                    )
                  ))}
                </div>
                
                <div className="card-preview-abilities">
                  {card.abilities && card.abilities.map((ability, index) => (
                    <div key={index} className="card-preview-ability">
                      {ability.effect}
                    </div>
                  ))}
                </div>
                
                <div className="card-preview-flavor">
                  {card.flavor}
                </div>
                
                {card.type === 'Familiar' && (
                  <div className="card-preview-stats">
                    <div className="card-preview-strength">
                      <Sword size={16} />
                      {card.strength}
                    </div>
                    <div className="card-preview-health">
                      <Shield size={16} />
                      {card.health}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  // Render game card
  const renderGameCard = () => {
    const sizeClasses = {
      tiny: 'w-10 h-14',
      small: 'w-14 h-20',
      normal: 'w-20 h-28',
      large: 'w-28 h-40'
    };
    
    // Determine card status indicators
    const hasStatusEffect = card.stunned || card.poisoned || card.shielded || card.buffed;
    const isRested = card.rested || false;
    
    return (
      <motion.div
        ref={cardRef}
        className={`
          game-card 
          ${card.type?.toLowerCase() || 'unknown'} 
          ${isRested ? 'rested' : ''} 
          ${isSelected ? 'selected' : ''} 
          ${isTargeted ? 'targeted' : ''} 
          ${isValidTarget ? 'valid-target' : ''} 
          ${hasStatusEffect ? 'has-status' : ''}
          ${sizeClasses[size]}
          ${className}
        `}
        onClick={handleCardClick}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        draggable={isInteractive && !faceDown}
        onDragStart={handleCardDragStart}
        whileHover={isInteractive && !faceDown ? { y: -5, scale: 1.02, transition: { duration: 0.2 } } : {}}
        animate={isSelected ? { y: -10, scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.7)' } : {}}
      >
        {/* Card content */}
        {!faceDown ? (
          <>
            <div className="game-card-inner">
              <div className="game-card-name">{card.name}</div>
              
              {/* Element costs */}
              <div className="game-card-elements">
                {Object.entries(card.elements || {}).map(([element, count]) => (
                  count > 0 && (
                    <div key={element} className={`element-cost ${element}`}>
                      {getElementIcon(element)}
                      <span>{count}</span>
                    </div>
                  )
                ))}
              </div>
              
              {/* Card type */}
              <div className="game-card-type">{card.type}</div>
              
              {/* Familiar stats */}
              {card.type === 'Familiar' && (
                <div className="game-card-stats">
                  <div className="game-card-strength">
                    <Sword size={12} />
                    <span>{card.strength}</span>
                  </div>
                  <div className="game-card-health">
                    <Shield size={12} />
                    <span>{card.health}</span>
                  </div>
                </div>
              )}
              
              {/* Status indicators */}
              {hasStatusEffect && (
                <div className="game-card-status">
                  {card.stunned && (
                    <div className="status-indicator stunned">
                      <Clock size={12} />
                    </div>
                  )}
                  {card.poisoned && (
                    <div className="status-indicator poisoned">
                      <AlertCircle size={12} />
                    </div>
                  )}
                  {card.shielded && (
                    <div className="status-indicator shielded">
                      <Shield size={12} />
                    </div>
                  )}
                  {card.buffed && (
                    <div className="status-indicator buffed">
                      <Sparkles size={12} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="game-card-back">
            <img src="/assets/card-back-new.png" alt="Card Back" />
          </div>
        )}
      </motion.div>
    );
  };
  
  // Render KonivrER card
  const renderKonivrERCard = () => {
    const sizeClasses = {
      tiny: 'w-12 h-16',
      small: 'w-16 h-24',
      normal: 'w-24 h-36',
      large: 'w-32 h-48'
    };
    
    // Determine card rarity styling
    const rarityClass = card.rarity ? card.rarity.toLowerCase() : 'common';
    
    // Determine card status
    const isRested = card.rested || false;
    const hasCounter = card.counters && card.counters > 0;
    
    return (
      <motion.div
        ref={cardRef}
        className={`
          konivrer-card 
          ${card.type?.toLowerCase() || 'unknown'} 
          ${rarityClass}
          ${isRested ? 'rested' : ''} 
          ${isSelected ? 'selected' : ''} 
          ${isTargeted ? 'targeted' : ''} 
          ${hasCounter ? 'has-counter' : ''}
          ${sizeClasses[size]}
          ${className}
        `}
        onClick={handleCardClick}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        draggable={isInteractive && !faceDown}
        onDragStart={handleCardDragStart}
        whileHover={isInteractive && !faceDown ? { y: -5, scale: 1.05, transition: { duration: 0.2 } } : {}}
        animate={isSelected ? { y: -10, scale: 1.1, boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' } : {}}
      >
        {!faceDown ? (
          <>
            {/* Card frame */}
            <div className="konivrer-card-frame">
              {/* Card header */}
              <div className="konivrer-card-header">
                <div className="konivrer-card-name">{card.name}</div>
                <div className="konivrer-card-cost">
                  {Object.entries(card.elements || {}).map(([element, count]) => (
                    count > 0 && (
                      <div key={element} className={`element-icon ${element}`}>
                        {getElementIcon(element)}
                        <span>{count}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {/* Card art */}
              <div className="konivrer-card-art">
                {/* This would be an actual image in a real implementation */}
                <div className="konivrer-card-art-placeholder">
                  {card.type === 'Familiar' && <Sword size={24} />}
                  {card.type === 'Spell' && <Zap size={24} />}
                  {card.type === 'Flag' && <Crown size={24} />}
                  {card.type === 'Azoth' && <Star size={24} />}
                </div>
              </div>
              
              {/* Card type */}
              <div className="konivrer-card-type-line">
                <div className="konivrer-card-type">{card.type}</div>
                {card.subtype && (
                  <div className="konivrer-card-subtype">- {card.subtype}</div>
                )}
              </div>
              
              {/* Card text */}
              <div className="konivrer-card-text">
                {card.abilities && card.abilities.map((ability, index) => (
                  <div key={index} className="konivrer-card-ability">
                    {ability.effect}
                  </div>
                ))}
                
                {card.flavor && (
                  <div className="konivrer-card-flavor">
                    <em>{card.flavor}</em>
                  </div>
                )}
              </div>
              
              {/* Card footer */}
              <div className="konivrer-card-footer">
                <div className="konivrer-card-set">{card.set}</div>
                <div className="konivrer-card-rarity">{card.rarity}</div>
                {card.artist && (
                  <div className="konivrer-card-artist">Art by: {card.artist}</div>
                )}
              </div>
              
              {/* Stats for Familiar cards */}
              {card.type === 'Familiar' && (
                <div className="konivrer-card-stats">
                  <div className="konivrer-card-strength">
                    <Sword size={16} />
                    <span>{card.strength}</span>
                  </div>
                  <div className="konivrer-card-health">
                    <Shield size={16} />
                    <span>{card.health}</span>
                  </div>
                </div>
              )}
              
              {/* Counters */}
              {hasCounter && (
                <div className="konivrer-card-counter">
                  <div className="counter-value">{card.counters}</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="konivrer-card-back">
            <img src="/assets/card-back-new.png" alt="Card Back" />
          </div>
        )}
      </motion.div>
    );
  };
  
  // Render card preview
  const renderCardPreview = () => {
    // Position classes
    const positionClasses = {
      left: 'preview-left',
      right: 'preview-right',
      top: 'preview-top',
      bottom: 'preview-bottom',
      center: 'preview-center'
    };
    
    return (
      <motion.div
        ref={cardRef}
        className={`card-preview-component ${positionClasses[previewPosition]} ${expanded ? 'expanded' : ''} ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={expanded ? {
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        } : {}}
      >
        {/* Preview header */}
        <div className="preview-header">
          <h3 className="preview-title">{card.name}</h3>
          <div className="preview-controls">
            <button 
              className="preview-control-button"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Normal view" : "Expanded view"}
            >
              <Maximize2 size={18} />
            </button>
            <button 
              className="preview-control-button"
              onClick={() => setShowCardDetails(!showCardDetails)}
              title={showCardDetails ? "Hide details" : "Show details"}
            >
              <Info size={18} />
            </button>
            {onClose && (
              <button 
                className="preview-control-button"
                onClick={onClose}
                title="Close preview"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        {/* Card display */}
        <div className="preview-card-container">
          <div className={`preview-card ${card.type?.toLowerCase() || 'unknown'}`}>
            {/* Card header */}
            <div className="preview-card-header">
              <div className="preview-card-name">{card.name}</div>
              <div className="preview-card-cost">
                {Object.entries(card.elements || {}).map(([element, count]) => (
                  count > 0 && (
                    <div key={element} className={`element-icon ${element}`}>
                      {getElementIcon(element)}
                      <span>{count}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            {/* Card art */}
            <div className="preview-card-art">
              {/* This would be an actual image in a real implementation */}
              <div className="preview-card-art-placeholder">
                {card.type === 'Familiar' && <Sword size={32} />}
                {card.type === 'Spell' && <Zap size={32} />}
                {card.type === 'Flag' && <Crown size={32} />}
                {card.type === 'Azoth' && <Star size={32} />}
              </div>
            </div>
            
            {/* Card type */}
            <div className="preview-card-type-line">
              <div className="preview-card-type">{card.type}</div>
              {card.subtype && (
                <div className="preview-card-subtype">- {card.subtype}</div>
              )}
            </div>
            
            {/* Card text */}
            <div className="preview-card-text">
              {card.abilities && card.abilities.map((ability, index) => (
                <div key={index} className="preview-card-ability">
                  {ability.effect}
                </div>
              ))}
              
              {card.flavor && (
                <div className="preview-card-flavor">
                  <em>{card.flavor}</em>
                </div>
              )}
            </div>
            
            {/* Card footer */}
            <div className="preview-card-footer">
              <div className="preview-card-set">{card.set}</div>
              <div className="preview-card-rarity">{card.rarity}</div>
              {card.artist && (
                <div className="preview-card-artist">Art by: {card.artist}</div>
              )}
            </div>
            
            {/* Stats for Familiar cards */}
            {card.type === 'Familiar' && (
              <div className="preview-card-stats">
                <div className="preview-card-strength">
                  <Sword size={20} />
                  <span>{card.strength}</span>
                </div>
                <div className="preview-card-health">
                  <Shield size={20} />
                  <span>{card.health}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Card details */}
        {showCardDetails && (
          <div className="preview-details">
            <h4 className="details-heading">Card Details</h4>
            <div className="details-content">
              <div className="details-row">
                <span className="details-label">Type:</span>
                <span className="details-value">{card.type}</span>
              </div>
              {card.subtype && (
                <div className="details-row">
                  <span className="details-label">Subtype:</span>
                  <span className="details-value">{card.subtype}</span>
                </div>
              )}
              <div className="details-row">
                <span className="details-label">Rarity:</span>
                <span className="details-value">{card.rarity}</span>
              </div>
              <div className="details-row">
                <span className="details-label">Set:</span>
                <span className="details-value">{card.set}</span>
              </div>
              {card.artist && (
                <div className="details-row">
                  <span className="details-label">Artist:</span>
                  <span className="details-value">{card.artist}</span>
                </div>
              )}
              {card.type === 'Familiar' && (
                <>
                  <div className="details-row">
                    <span className="details-label">Strength:</span>
                    <span className="details-value">{card.strength}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Health:</span>
                    <span className="details-value">{card.health}</span>
                  </div>
                </>
              )}
              {card.elements && Object.keys(card.elements).length > 0 && (
                <div className="details-row">
                  <span className="details-label">Elements:</span>
                  <div className="details-elements">
                    {Object.entries(card.elements).map(([element, count]) => (
                      count > 0 && (
                        <div key={element} className={`element-tag ${element}`}>
                          {getElementIcon(element)}
                          <span>{element}: {count}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              {card.keywords && card.keywords.length > 0 && (
                <div className="details-row">
                  <span className="details-label">Keywords:</span>
                  <div className="details-keywords">
                    {card.keywords.map((keyword, index) => (
                      <div key={index} className="keyword-tag">
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };
  
  // Render the appropriate variant
  if (faceDown) {
    return renderFaceDownCard();
  }
  
  switch (variant) {
    case 'game':
      return renderGameCard();
    case 'konivrer':
      return renderKonivrERCard();
    case 'preview':
      return renderCardPreview();
    default:
      return renderStandardCard();
  }
};

export default UnifiedCard;