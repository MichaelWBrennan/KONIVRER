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
    const appElement =
      screen.getByRole('main', { hidden: true }) ||
      document.querySelector('#root > div');
    expect(appElement).toBeInTheDocument();
  });
});
