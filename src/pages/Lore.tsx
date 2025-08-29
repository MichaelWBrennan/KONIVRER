import React from "react";
import * as s from "./lore.css.ts";

export const Lore: React.FC = () => {
  // Element definitions derived from the lore content above
  type ElementDefinition = {
    name: "Aether" | "Air" | "Fire" | "Earth" | "Water" | "Nether";
    epithet: string; // e.g., Principle, Adaptation
    definition: string; // e.g., "Act how is right; ..."
    stance: string; // e.g., "You prefer clear principle ..."
  };

  const elementDefinitions: ElementDefinition[] = [
    {
      name: "Aether",
      epithet: "Principle",
      definition:
        "Do what is right; act clearly and quickly when things are confusing.",
      stance: "You care about what is right and take clear action.",
    },
    {
      name: "Air",
      epithet: "Adaptation",
      definition: "Do what works; help and teach while things change.",
      stance: "You like trying, learning, and guiding others.",
    },
    {
      name: "Fire",
      epithet: "Aspiration",
      definition:
        "Work toward a better world; care for and defend others as you build.",
      stance: "You dream big and protect people while moving forward.",
    },
    {
      name: "Earth",
      epithet: "Integrity",
      definition:
        "Do what is fair; set clear rules and check that things are done well.",
      stance: "You keep order and make sure standards are met.",
    },
    {
      name: "Water",
      epithet: "Potential",
      definition: "See what could be; bring pieces together to open new paths.",
      stance: "You connect ideas and people to discover new possibilities.",
    },
    {
      name: "Nether",
      epithet: "Capability",
      definition:
        "Plan how things can work; design steps that make ideas real.",
      stance: "You build skills and plans that help everyone do more.",
    },
  ];

  // Utility: generate k-combinations of the elements
  function generateCombinations<T>(items: T[], size: number): T[][] {
    const results: T[][] = [];
    function helper(startIndex: number, combo: T[]): any {
      if (combo.length === size) {
        results.push([...combo]);
        return;
      }
      for (let i = startIndex; i < items.length; i++) {
        combo.push(items[i]);
        helper(i + 1, combo);
        combo.pop();
      }
    }
    helper(0, []);
    return results;
  }

  // Normalize a pair key for lookups regardless of order
  function pairKey(a: string, b: string): string {
    return [a, b].sort().join("|");
  }

  // Special adjacent pair names/descriptions already present in the lore
  const specialPairs: Record<string, { title: string; description: string }> = {
    [pairKey("Water", "Aether")]: {
      title: "Rainbow",
      description: "Quickly put things together to spark new ideas.",
    },
    [pairKey("Aether", "Air")]: {
      title: "Aurora",
      description: "Smart, flexible action that shows the way.",
    },
    [pairKey("Air", "Fire")]: {
      title: "Flare",
      description: "Action that inspires and keeps people safe.",
    },
    [pairKey("Fire", "Nether")]: {
      title: "Char",
      description: "Careful planning that turns into bold, helpful action.",
    },
    [pairKey("Nether", "Earth")]: {
      title: "Compost",
      description: "Careful plans improved by review become strong and steady.",
    },
    [pairKey("Earth", "Water")]: {
      title: "Mud",
      description: "Helpful limits that help new things grow safely.",
    },
  };

  function summarize(definition: string): string {
    const firstClause = definition.split(";")[0].trim();
    return firstClause.endsWith(".") ? firstClause.slice(0, -1) : firstClause;
  }

  function buildDefaultDescription(combo: ElementDefinition[]): string {
    const clauses = combo.map((e) => summarize(e.definition));
    return `Combined stance: ${clauses.join(" — ")}.`;
  }

  const combinations2 = generateCombinations(elementDefinitions, 2);
  const combinations3 = generateCombinations(elementDefinitions, 3);
  const combinations4 = generateCombinations(elementDefinitions, 4);
  const combinations5 = generateCombinations(elementDefinitions, 5);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>KONIVRER Lore</h1>
        <p className={s.subtitle}>
          Discover the rich history and mythology behind the cards
        </p>
      </div>

      <div className={s.content}>
        <section className={s.section}>
          <h2 className={s.sectionTitle}>The World of KONIVRER</h2>
          <p className={s.text}>
            KONIVRER is a mystical realm where ancient forces of nature,
            technology, and magic converge. The world was born from the
            collision of three primordial elements: the natural world, the
            arcane arts, and the emerging power of innovation.
          </p>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>The Three Realms</h2>
          <div className={s.realmCard}>
            <h3 className={s.realmTitle}>The Natural Realm</h3>
            <p className={s.realmDescription}>
              Home to ancient forests, majestic mountains, and untamed
              wilderness. The Natural Realm represents the raw power of the
              earth and the resilience of life.
            </p>
          </div>

          <div className={s.realmCard}>
            <h3 className={s.realmTitle}>The Arcane Realm</h3>
            <p className={s.realmDescription}>
              A dimension of pure magic and mystical energy, where the laws of
              physics bend to the will of powerful spellcasters.
            </p>
          </div>

          <div className={s.realmCard}>
            <h3 className={s.realmTitle}>The Innovation Realm</h3>
            <p className={s.realmDescription}>
              A realm of progress and technological advancement, where brilliant
              minds create wonders beyond imagination.
            </p>
          </div>
        </section>

        <section className={s.section}>
          <h2 className={s.sectionTitle}>
            The Six Divine Elements and Their Virtues
          </h2>
          <div className={s.diagramContainer}>
            <img
              className={s.diagramImage}
              src="/assets/lore/six-divine-elements.png"
              alt="The Six Divine Elements and Their Virtues diagram"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/card-back-new.png";
              }}
            />
            <p className={s.caption}>
              A cosmology of six elements governing practice and purpose. Each
              wedge expresses a guiding stance and the paired virtues that
              animate it.
            </p>
          </div>
          <div className={s.virtuesGrid}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Aether — Principle</h3>
              <p className={s.virtueText}>
                Do what is right; act clearly and quickly when things are
                confusing. You care about what is right and take clear action.
              </p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Air — Adaptation</h3>
              <p className={s.virtueText}>
                Do what works; help and teach while things change. You like
                trying, learning, and guiding others.
              </p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Fire — Aspiration</h3>
              <p className={s.virtueText}>
                Work toward a better world; care for and defend others as you
                build. You dream big and protect people while moving forward.
              </p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Earth — Integrity</h3>
              <p className={s.virtueText}>
                Do what is fair; set clear rules and check that things are done
                well. You keep order and make sure standards are met.
              </p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Water — Potential</h3>
              <p className={s.virtueText}>
                See what could be; bring pieces together to open new paths. You
                connect ideas and people to discover new possibilities.
              </p>
            </div>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Nether — Capability</h3>
              <p className={s.virtueText}>
                Plan how things can work; design steps that make ideas real. You
                build skills and plans that help everyone do more.
              </p>
            </div>
          </div>

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Color Alignment</h3>
              <p className={s.virtueText}>
                Like a sixfold color pie, each person, faction, and card aligns
                to one or more elements. Adjacent elements are natural allies;
                across the wheel lie tensions.
              </p>
            </div>
          </div>

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Adjacent Pairs</h3>
              <p className={s.virtueText}>
                Water + Aether: Rainbow — Quickly put things together to spark
                new ideas.
              </p>
              <p className={s.virtueText}>
                Aether + Air: Aurora — Smart, flexible action that shows the
                way.
              </p>
              <p className={s.virtueText}>
                Air + Fire: Flare — Action that inspires and keeps people safe.
              </p>
              <p className={s.virtueText}>
                Fire + Nether: Char — Careful planning that turns into bold,
                helpful action.
              </p>
              <p className={s.virtueText}>
                Nether + Earth: Compost — Careful plans improved by review
                become strong and steady.
              </p>
              <p className={s.virtueText}>
                Earth + Water: Mud — Helpful limits that help new things grow
                safely.
              </p>
            </div>
          </div>

          {/* Programmatic combinations for 2, 3, 4, 5 elements */}
          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Two-Element Combinations</h3>
              {combinations2.map((combo, idx) => {
                const names = combo.map((e) => e.name);
                const key = pairKey(names[0], names[1]);
                const special = specialPairs[key];
                const title = special
                  ? `${names[0]} + ${names[1]} — ${special.title}`
                  : `${names[0]} + ${names[1]}`;
                const description = special
                  ? special.description
                  : buildDefaultDescription(combo);
                return (
                  <p key={idx} className={s.virtueText}>
                    <strong>{title}:</strong> {description}
                  </p>
                );
              })}
            </div>
          </div>

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Three-Element Combinations</h3>
              {combinations3.map((combo, idx) => (
                <p key={idx} className={s.virtueText}>
                  <strong>{combo.map((e) => e.name).join(" + ")}</strong>:{" "}
                  {buildDefaultDescription(combo)}
                </p>
              ))}
            </div>
          </div>

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Four-Element Combinations</h3>
              {combinations4.map((combo, idx) => (
                <p key={idx} className={s.virtueText}>
                  <strong>{combo.map((e) => e.name).join(" + ")}</strong>:{" "}
                  {buildDefaultDescription(combo)}
                </p>
              ))}
            </div>
          </div>

          <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
            <div className={s.virtueCard}>
              <h3 className={s.virtueTitle}>Five-Element Combinations</h3>
              {combinations5.map((combo, idx) => (
                <p key={idx} className={s.virtueText}>
                  <strong>{combo.map((e) => e.name).join(" + ")}</strong>:{" "}
                  {buildDefaultDescription(combo)}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
