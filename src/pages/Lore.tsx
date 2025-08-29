import React from 'react';
import * as s from './lore.css.ts';

export const Lore: React.FC = () => {
  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>KONIVRER Lore</h1>
        <p className={s.subtitle}>Discover the rich history and mythology behind the cards</p>
      </div>

      <div className={s.content}>
        <section className={s.section}>
          <h2 className={s.sectionTitle}>The World of KONIVRER</h2>
          <p className={s.text}>
            KONIVRER is a mystical realm where ancient forces of nature, technology, and magic 
            converge. The world was born from the collision of three primordial elements: 
            the natural world, the arcane arts, and the emerging power of innovation.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>The Three Realms</h2>
          <div className={s.realmCard}>
            <h3 className={s.realmTitle}>The Natural Realm</h3>
            <p className={s.realmDescription}>
              Home to ancient forests, majestic mountains, and untamed wilderness. 
              The Natural Realm represents the raw power of the earth and the resilience of life.
            </p>
          </div>
          
          <div className={s.realmCard}>
            <h3 className={s.realmTitle}>The Arcane Realm</h3>
            <p className={s.realmDescription}>
              A dimension of pure magic and mystical energy, where the laws of physics 
              bend to the will of powerful spellcasters.
            </p>
          </div>
          
          <div className={s.realmCard}>
            <h3 className={s.realmTitle}>The Innovation Realm</h3>
            <p className={s.realmDescription}>
              A realm of progress and technological advancement, where brilliant minds 
              create wonders beyond imagination.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
