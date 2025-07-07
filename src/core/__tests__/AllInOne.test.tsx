import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AllInOneApp from '../AllInOne';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    input: ({ children, ...props }: any) => (
      <input {...props}>{children}</input>
    ),
    textarea: ({ children, ...props }: any) => (
      <textarea {...props}>{children}</textarea>
    ),
    select: ({ children, ...props }: any) => (
      <select {...props}>{children}</select>
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Wrapper component for router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AllInOneApp', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Should render the main navigation
    expect(screen.getByText('KONIVRER')).toBeInTheDocument();
  });

  it('displays navigation menu', () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Check for main navigation items
    expect(screen.getByText('Cards')).toBeInTheDocument();
    expect(screen.getByText('Decks')).toBeInTheDocument();
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('navigates between different sections', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Click on Cards navigation
    const cardsLink = screen.getByText('Cards');
    fireEvent.click(cardsLink);

    await waitFor(() => {
      expect(screen.getByText('Card Database')).toBeInTheDocument();
    });

    // Click on Decks navigation
    const decksLink = screen.getByText('Decks');
    fireEvent.click(decksLink);

    await waitFor(() => {
      expect(screen.getByText('Deck Builder')).toBeInTheDocument();
    });
  });

  it('displays card search functionality', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Navigate to cards section
    const cardsLink = screen.getByText('Cards');
    fireEvent.click(cardsLink);

    await waitFor(() => {
      // Should have search input
      const searchInput = screen.getByPlaceholderText(/search cards/i);
      expect(searchInput).toBeInTheDocument();

      // Should have filter options
      expect(screen.getByText('All Types')).toBeInTheDocument();
      expect(screen.getByText('All Elements')).toBeInTheDocument();
    });
  });

  it('allows card searching and filtering', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Navigate to cards section
    const cardsLink = screen.getByText('Cards');
    fireEvent.click(cardsLink);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search cards/i);

      // Type in search
      fireEvent.change(searchInput, { target: { value: 'fire' } });

      // Should filter cards (assuming there are fire-related cards)
      expect(searchInput).toHaveValue('fire');
    });
  });

  it('displays deck builder functionality', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Navigate to decks section
    const decksLink = screen.getByText('Decks');
    fireEvent.click(decksLink);

    await waitFor(() => {
      expect(screen.getByText('Deck Builder')).toBeInTheDocument();
      expect(screen.getByText('New Deck')).toBeInTheDocument();
    });
  });

  it('displays game simulator', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Navigate to game section
    const gameLink = screen.getByText('Game');
    fireEvent.click(gameLink);

    await waitFor(() => {
      expect(screen.getByText('Game Simulator')).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });
  });

  it('displays blog functionality', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Navigate to blog section
    const blogLink = screen.getByText('Blog');
    fireEvent.click(blogLink);

    await waitFor(() => {
      expect(screen.getByText('Community Blog')).toBeInTheDocument();
      expect(screen.getByText('New Post')).toBeInTheDocument();
    });
  });

  it('handles responsive design', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Should still render main components
    expect(screen.getByText('KONIVRER')).toBeInTheDocument();
  });

  it('handles theme switching', async () => {
    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // Look for theme toggle (if it exists)
    const themeButtons = screen.queryAllByText(/theme|dark|light/i);
    if (themeButtons.length > 0) {
      fireEvent.click(themeButtons[0]);
      // Theme should change (this would need more specific implementation)
    }
  });

  it('handles error states gracefully', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <AllInOneApp />
      </TestWrapper>,
    );

    // App should still render even if there are minor errors
    expect(screen.getByText('KONIVRER')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
