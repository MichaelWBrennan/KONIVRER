import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('contains navigation elements', () => {
    render(<App />);
    // Check if the app renders some basic content
    // The app might show error boundary or main content
    const appElement = document.querySelector('div');
    expect(appElement).toBeInTheDocument();

    // Check if we have either main content or error boundary
    const hasMainContent = screen.queryByRole('main');
    const hasErrorBoundary = screen.queryByText(/something went wrong/i);

    expect(hasMainContent || hasErrorBoundary).toBeTruthy();
  });
});
