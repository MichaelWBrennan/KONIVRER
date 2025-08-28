import React, { useEffect, useState } from 'react';
import * as s from './settings.css.ts';

export const Settings: React.FC     = () => {
  const [theme, setTheme]      = useState<'dark'|'light'>(() => (document.documentElement.getAttribute('data-theme') as any) || 'dark');
  const [contrast, setContrast]      = useState<string>(() => document.documentElement.getAttribute('data-contrast') || 'normal');
  const [fontSize, setFontSize]      = useState<string>(() => document.documentElement.getAttribute('data-font-size') || 'medium');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    localStorage.setItem('contrastMode', contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const clearCaches      = async () => {
    if ('caches' in window) {
      const names      = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      alert('Offline caches cleared');
    }
  };

  return (
    <div className={s.root}>
      <section className={s.section}>
        <div className={s.sectionTitle}>Appearance</div>
        <div className={s.row}>
          <label>
            Theme
            <select className="filter-select" value={theme} onChange={(e)=>setTheme(e.target.value as any)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <label>
            Contrast
            <select className="filter-select" value={contrast} onChange={(e)=>setContrast(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="high">High Contrast</option>
            </select>
          </label>
          <label>
            Font size
            <select className="filter-select" value={fontSize} onChange={(e)=>setFontSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="extra-large">Extra Large</option>
            </select>
          </label>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.sectionTitle}>Offline</div>
        <div className={s.actions}>
          <button className="btn btn-secondary" onClick={clearCaches}>Clear offline caches</button>
        </div>
      </section>
    </div>
  );
};

