import React from 'react';
import * as s from './lore.css.ts';

export const Lore: React.FC : any = () => {
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

        <section className={s.section}>
          <h2 className={s.sectionTitle}>The Six Divine Elements and Their Virtues</h2>
          <div className={s.diagramContainer}>
            <img
              className={s.diagramImage}
              src="/assets/lore/six-divine-elements.png"
              alt="The Six Divine Elements and Their Virtues diagram"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/card-back-new.png";
              }}
            />
            <p className={s.caption}>
              A cosmology of six elements governing practice and purpose. Each wedge
              expresses a guiding stance and the paired virtues that animate it.
            </p>
          </div>
          <div className={s.virtuesGrid}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Aether — Principle</h3>
              <p className={s.virtueText}>Act how is right; improvise and expedite to cut through ambiguity.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Air — Adaptation</h3>
              <p className={s.virtueText}>Do whatever works; educate and improvise while guiding change.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Fire — Aspiration</h3>
              <p className={s.virtueText}>What the world should be; provide and protect to build toward ideals.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Earth — Integrity</h3>
              <p className={s.virtueText}>Do whatever is right; supervise and inspect, imposing necessary boundaries.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Water — Potential</h3>
              <p className={s.virtueText}>What the world could be; assemble and expedite to unlock possibilities.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Nether — Capability</h3>
              <p className={s.virtueText}>Act how you could; plan and design to make the possible practical.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


