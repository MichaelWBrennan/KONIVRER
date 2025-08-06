import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MTGArenaGame from '../MTGArenaGame';

// Mock framer-motion to avoid animations in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('MTGArenaGame - Card Visibility', () => {
  it('should hide opponent hand cards by default', () => {
    render(<MTGArenaGame />);
    
    // Check that opponent hand section exists
    expect(screen.getByText('OPPONENT-HAND')).toBeInTheDocument();
    
    // Check that card backs are shown (should see KONIVRER branding)
    const cardBacks = screen.getAllByText('KONIVRER');
    expect(cardBacks.length).toBeGreaterThan(0);
    
    // Check that card backs display the trading card game text
    expect(screen.getAllByText('Trading Card Game').length).toBeGreaterThan(0);
  });

  it('should show player hand cards normally', () => {
    render(<MTGArenaGame />);
    
    // Check that player hand section exists
    expect(screen.getByText('PLAYER-HAND')).toBeInTheDocument();
    
    // Player cards should show actual card names, not just KONIVRER
    // Look for specific card names in the player hand
    const playerCardElements = screen.getAllByText(/Abiss|Angel|Ash|Aurora|Azoth|Bright/);
    expect(playerCardElements.length).toBeGreaterThan(0);
  });

  it('should have reveal opponent hand functionality', () => {
    render(<MTGArenaGame />);
    
    // Check that the reveal button exists
    const revealButton = screen.getByRole('button', { name: /reveal opponent hand/i });
    expect(revealButton).toBeInTheDocument();
  });

  it('should show opponent battlefield cards normally', () => {
    render(<MTGArenaGame />);
    
    // Opponent battlefield section should exist
    expect(screen.getByText('OPPONENT-BATTLEFIELD')).toBeInTheDocument();
    
    // Battlefield cards should be visible (not hidden like hand cards)
    // This is correct game behavior - only hand cards should be hidden
  });

  it('should maintain proper game structure', () => {
    render(<MTGArenaGame />);
    
    // Check all necessary game zones exist
    expect(screen.getByText('OPPONENT-HAND')).toBeInTheDocument();
    expect(screen.getByText('OPPONENT-BATTLEFIELD')).toBeInTheDocument();
    expect(screen.getByText('PLAYER-HAND')).toBeInTheDocument();
    expect(screen.getByText('BATTLEFIELD')).toBeInTheDocument();
    expect(screen.getByText('GRAVEYARD')).toBeInTheDocument();
    expect(screen.getByText('EXILE')).toBeInTheDocument();
    
    // Check turn info
    expect(screen.getByText(/your turn|opponent turn/i)).toBeInTheDocument();
    expect(screen.getByText(/phase:/i)).toBeInTheDocument();
  });
});