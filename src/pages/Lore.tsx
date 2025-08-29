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
              <p className={s.virtueText}>Do whatever works; educate and guide while shaping change in the moment.</p>
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

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Color Alignment</h3>
              <p className={s.virtueText}>
                Like a sixfold color pie, each person, faction, and card aligns to one or more
                elements. Adjacent elements are natural allies; across the wheel lie tensions.
                Use the stances below to find your resonance.
              </p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Aether</h3>
              <p className={s.virtueText}>You prefer clear principle over convenience. You cut knots and act.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Air</h3>
              <p className={s.virtueText}>You value results and teaching; you iterate fast and guide others.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Fire</h3>
              <p className={s.virtueText}>You chase ideals and protect the vulnerable while pushing forward.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Earth</h3>
              <p className={s.virtueText}>You uphold duty, standards, and structure; you inspect and enforce.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Water</h3>
              <p className={s.virtueText}>You gather, connect, and explore what could be through assembly.</p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Nether</h3>
              <p className={s.virtueText}>You architect capability; you plan and design for future leverage.</p>
            </div>
          </div>

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Adjacent Pairs</h3>
              <p className={s.virtueText}>Water + Aether: Rainbow — Expedite assembly toward emergent insight.</p>
              <p className={s.virtueText}>Aether + Air: Aurora — Educated improvisation that illuminates the path.</p>
              <p className={s.virtueText}>Air + Fire: Flare — Guided action that rallies and protects.</p>
              <p className={s.virtueText}>Fire + Nether: Char — Design channeled into decisive provision.</p>
              <p className={s.virtueText}>Nether + Earth: Putrefaction — Plans refined by inspection into resilience.</p>
              <p className={s.virtueText}>Earth + Water: Mud — Boundaries that shape and stabilize new growth.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


