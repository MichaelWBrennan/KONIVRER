import React, { useEffect, useMemo, useState } from "react";
import * as s from "./lore.css.ts";

export const Lore: React.FC = () => {
  // Tabs configuration: first tab is existing static content
  const tabs: {
    id: string;
    label: string;
    src?: string;
    isStatic?: boolean;
  }[] = [
    { id: "elements", label: "Six Elements", isStatic: true },
    {
      id: "societies",
      label: "Societies & Eras",
      src: "/assets/lore/societies.txt",
    },
    {
      id: "ars_goetia",
      label: "Ars Goetia",
      src: "/assets/lore/ars_goetia.txt",
    },
    {
      id: "mesopotamian",
      label: "Hidden Mesopotamian Pantheon",
      src: "/assets/lore/mesopotamian.txt",
    },
    {
      id: "shem",
      label: "Shem HaMephoras (72 Angels)",
      src: "/assets/lore/shem.txt",
    },
    {
      id: "remaining",
      label: "Remaining (Archangels, etc.)",
      src: "/assets/lore/remaining.txt",
    },
    {
      id: "origin",
      label: "Origin of Species: Mythological Clades",
      src: "/assets/lore/origin.txt",
    },
    { id: "summoning", label: "Summoning", src: "/assets/lore/summoning.txt" },
    {
      id: "elements_east",
      label: "Elements (Eastern Flavor)",
      src: "/assets/lore/elements_east.txt",
    },
    { id: "veil", label: "The Shattered Veil", src: "/assets/lore/veil.txt" },
    {
      id: "elements_west",
      label: "Elements (Western Flavor)",
      src: "/assets/lore/elements_west.txt",
    },
    { id: "worlds", label: "Worlds & Lokas", src: "/assets/lore/worlds.txt" },
    {
      id: "aether",
      label: "Aether Magic System",
      src: "/assets/lore/aether.txt",
    },
    {
      id: "laws_history",
      label: "Laws & Pre-History",
      src: "/assets/lore/laws_history.txt",
    },
    { id: "ethics", label: "Ethics Systems", src: "/assets/lore/ethics.txt" },
    { id: "taoism", label: "Taoism (AIFNW)", src: "/assets/lore/taoism.txt" },
    {
      id: "items_east",
      label: "Items (Eastern)",
      src: "/assets/lore/items_east.txt",
    },
    {
      id: "abrahamism",
      label: "Abrahamism (IFNEW)",
      src: "/assets/lore/abrahamism.txt",
    },
    {
      id: "dharmism",
      label: "Dharmism (AINEW)",
      src: "/assets/lore/dharmism.txt",
    },
    {
      id: "african",
      label: "African (IFNEW)",
      src: "/assets/lore/african.txt",
    },
    {
      id: "wildfolkism",
      label: "Wildfolkism (AIFNE)",
      src: "/assets/lore/wildfolkism.txt",
    },
    {
      id: "hellenism",
      label: "Hellenism (AIFEW)",
      src: "/assets/lore/hellenism.txt",
    },
    { id: "human", label: "Human & Celestials", src: "/assets/lore/human.txt" },
    {
      id: "infernal",
      label: "Infernal & Mythological",
      src: "/assets/lore/infernal.txt",
    },
    {
      id: "species",
      label: "Species (Ogre, Dvergr, etc.)",
      src: "/assets/lore/species.txt",
    },
    {
      id: "language",
      label: "Basik AnglΣ (Language)",
      src: "/assets/lore/language.txt",
    },
    {
      id: "alchemy",
      label: "Alxemi (Alchemy)",
      src: "/assets/lore/alchemy.txt",
    },
    {
      id: "prehistory",
      label: "Pre-History",
      src: "/assets/lore/prehistory.txt",
    },
    {
      id: "three_ages",
      label: "Three Ages",
      src: "/assets/lore/three_ages.txt",
    },
    {
      id: "classical",
      label: "Classical Era",
      src: "/assets/lore/classical.txt",
    },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [query, setQuery] = useState<string>("");
  const [loadedText, setLoadedText] = useState<string>("");

  useEffect(() => {
    const handler = (e: any) => setQuery(e.detail || "");
    window.addEventListener("lore-search", handler);
    return () => window.removeEventListener("lore-search", handler);
  }, []);

  useEffect(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab || tab.isStatic || !tab.src) {
      setLoadedText("");
      return;
    }

    const src = tab.src!;
    const label = tab.label;

    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) {
          setLoadedText(
            `Content not found for ${label}. Ensure file exists at ${src}.`
          );
          return;
        }
        const txt = await res.text();
        setLoadedText(txt);
      } catch (err) {
        setLoadedText(`Failed to load content: ${String(err)}`);
      }
    })();
  }, [activeTab]);

  const highlight = (text: string, q: string): React.ReactNode => {
    if (!q) return text;
    try {
      const parts = text.split(
        new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`, "gi")
      );
      return parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className={s.highlight}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      );
    } catch {
      return text;
    }
  };

  // ------------------ Existing content (static) ------------------
  type ElementDefinition = {
    name: "Aether" | "Air" | "Fire" | "Earth" | "Water" | "Nether";
    epithet: string;
    definition: string;
    stance: string;
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

  function pairKey(a: string, b: string): string {
    return [a, b].sort().join("|");
  }

  function comboKey(names: string[]): string {
    return [...names].sort().join("|");
  }

  const specialPairs: Record<string, { title: string; description: string }> = {
    // Aether pairs
    [pairKey("Aether", "Air")]: {
      title: "Pragmatism",
      description:
        "Aether supplies ethical clarity and decisive right action; Air brings flexible, teach-and-adapt methods. Together they drive pragmatic change anchored in principle.",
    },
    [pairKey("Aether", "Fire")]: {
      title: "Idealism",
      description:
        "Aether's moral compass sets just ends; Fire adds aspirational drive and protective courage. Together they become a value-led mission to uplift and defend.",
    },
    [pairKey("Aether", "Earth")]: {
      title: "Legalism",
      description:
        "Aether defines what is right; Earth codifies fairness with rules and standards. Together they form a covenantal order that enforces justice.",
    },
    [pairKey("Aether", "Water")]: {
      title: "Universalism",
      description:
        "Aether sets the moral horizon; Water connects people and ideas to include what could be. Together they seek inclusive, harmonious universals that unify.",
    },
    [pairKey("Aether", "Nether")]: {
      title: "Teleocracy",
      description:
        "Aether determines righteous goals; Nether designs the steps and capabilities to realize them. Together they practice duty-bound, purpose-first planning.",
    },

    // Air pairs
    [pairKey("Air", "Fire")]: {
      title: "Vanguardism",
      description:
        "Air teaches and adapts to changing contexts; Fire inspires and rallies to protect. Together they catalyze movements that learn fast and lead boldly.",
    },
    [pairKey("Air", "Earth")]: {
      title: "Gradualism",
      description:
        "Air allows methods to evolve; Earth preserves procedures and accountability. Together they build responsive yet disciplined institutions.",
    },
    [pairKey("Air", "Water")]: {
      title: "Pluralism",
      description:
        "Air iterates and shares understanding; Water synthesizes and bridges perspectives. Together they learn across differences to weave coherent pluralism.",
    },
    [pairKey("Air", "Nether")]: {
      title: "Technocracy",
      description:
        "Air experiments and improves; Nether engineers and executes. Together they turn lessons into working systems through rapid iteration.",
    },

    // Fire pairs
    [pairKey("Fire", "Earth")]: {
      title: "Progressivism",
      description:
        "Fire aims for a better world; Earth enforces standards and guardrails. Together they channel ambition into disciplined, verifiable progress.",
    },
    [pairKey("Fire", "Water")]: {
      title: "Humanism",
      description:
        "Fire seeks uplift and protection; Water connects humans and possibilities. Together they innovate to serve people and expand opportunity.",
    },
    [pairKey("Fire", "Nether")]: {
      title: "Activism",
      description:
        "Fire mobilizes for change and defense; Nether crafts plans and logistics. Together they run directed campaigns with actionable roadmaps.",
    },

    // Earth pairs
    [pairKey("Earth", "Water")]: {
      title: "Conservationism",
      description:
        "Earth sets limits, fairness, and verification; Water nurtures growth and renewal. Together they steward resources to regenerate and endure.",
    },
    [pairKey("Earth", "Nether")]: {
      title: "Institutionalism",
      description:
        "Earth demands standards and oversight; Nether operationalizes plans and capabilities. Together they deliver accountable programs with measurable outcomes.",
    },

    // Water pairs
    [pairKey("Water", "Nether")]: {
      title: "Developmentalism",
      description:
        "Water spots latent opportunities and connects actors; Nether builds the capabilities to realize them. Together they design systems that unlock potential.",
    },
  };

  const specialTriples: Record<string, { title: string; description: string }> =
    {
      // 3-element combinations (6 choose 3 = 20)
      "Aether|Air|Earth": { title: "Centrism", description: "" },
      "Aether|Air|Fire": { title: "Progressivism", description: "" },
      "Aether|Air|Nether": { title: "Technocracy", description: "" },
      "Aether|Air|Water": { title: "Universalism", description: "" },
      "Aether|Earth|Fire": { title: "Legalism", description: "" },
      "Aether|Earth|Nether": { title: "Statism", description: "" },
      "Aether|Earth|Water": { title: "Civism", description: "" },
      "Aether|Fire|Nether": { title: "Activism", description: "" },
      "Aether|Fire|Water": { title: "Altruism", description: "" },
      "Aether|Nether|Water": { title: "Developmentalism", description: "" },
      "Air|Earth|Fire": { title: "Conservatism", description: "" },
      "Air|Earth|Nether": { title: "Managerialism", description: "" },
      "Air|Earth|Water": { title: "Liberalism", description: "" },
      "Air|Fire|Nether": { title: "Dynamism", description: "" },
      "Air|Fire|Water": { title: "Anarchism", description: "" },
      "Air|Nether|Water": { title: "Pluralism", description: "" },
      "Earth|Fire|Nether": { title: "Industrialism", description: "" },
      "Earth|Fire|Water": { title: "Socialism", description: "" },
      "Earth|Nether|Water": { title: "Environmentalism", description: "" },
      "Fire|Nether|Water": { title: "Transhumanism", description: "" },
    };
  const specialQuads: Record<string, { title: string; description: string }> = {
    // 4-element combinations (6 choose 4 = 15)
    "Aether|Air|Earth|Fire": { title: "Reformism", description: "" },
    "Aether|Air|Earth|Nether": { title: "Institutionalism", description: "" },
    "Aether|Air|Earth|Water": { title: "Cosmopolitanism", description: "" },
    "Aether|Air|Fire|Nether": { title: "Modernism", description: "" },
    "Aether|Air|Fire|Water": { title: "Libertarianism", description: "" },
    "Aether|Air|Nether|Water": { title: "Constructivism", description: "" },
    "Aether|Earth|Fire|Nether": { title: "Militarism", description: "" },
    "Aether|Earth|Fire|Water": { title: "Pragmatism", description: "" },
    "Aether|Earth|Nether|Water": { title: "Stewardship", description: "" },
    "Aether|Fire|Nether|Water": { title: "Humanitarianism", description: "" },
    "Air|Earth|Fire|Nether": { title: "Productivism", description: "" },
    "Air|Earth|Fire|Water": { title: "Nationalism", description: "" },
    "Air|Earth|Nether|Water": { title: "Federalism", description: "" },
    "Air|Fire|Nether|Water": { title: "Accelerationism", description: "" },
    "Earth|Fire|Nether|Water": { title: "Expansionism", description: "" },
  };
  const specialQuints: Record<string, { title: string; description: string }> =
    {
      // 5-element combinations (6 choose 5 = 6)
      "Air|Earth|Fire|Nether|Water": {
        title: "Utilitarianism",
        description: "",
      },
      "Aether|Earth|Fire|Nether|Water": {
        title: "Traditionalism",
        description: "",
      },
      "Aether|Air|Fire|Nether|Water": { title: "Idealism", description: "" },
      "Aether|Air|Earth|Nether|Water": { title: "Pacifism", description: "" },
      "Aether|Air|Earth|Fire|Water": { title: "Communism", description: "" },
      "Aether|Air|Earth|Fire|Nether": { title: "Imperialism", description: "" },
    };

  function summarize(definition: string): string {
    const firstClause = definition.split(";")[0].trim();
    return firstClause.endsWith(".") ? firstClause.slice(0, -1) : firstClause;
  }

  function lowerFirst(text: string): string {
    return text.length === 0 ? text : text[0].toLowerCase() + text.slice(1);
  }

  function buildContributionExplanation(combo: ElementDefinition[]): string {
    const parts = combo.map((e) => {
      const short = lowerFirst(summarize(e.definition));
      return `${e.name} provides ${e.epithet.toLowerCase()} (${short})`;
    });
    return parts.join("; ") + ".";
  }

  const combinations2 = generateCombinations(elementDefinitions, 2);
  const combinations3 = generateCombinations(elementDefinitions, 3);
  const combinations4 = generateCombinations(elementDefinitions, 4);
  const combinations5 = generateCombinations(elementDefinitions, 5);

  const StaticElements = useMemo(
    () => (
      <section className={s.section}>
        <div className={s.diagramContainer}>
          <img
            className={s.diagramImage}
            src="https://drive.google.com/uc?export=view&id=1Xt7ECRN6yNh2yefyRDAnzS6DPwbaFgNj"
            alt="Six Divine Elements wheel showing Aether, Air, Fire, Earth, Water, and Nether"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/lore/six-divine-elements.png";
              (e.target as HTMLImageElement).onerror = () => {
                (e.target as HTMLImageElement).src =
                  "/assets/card-back-new.png";
              };
            }}
          />
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
            <h3 className={s.virtueTitle}>Two-Element Combinations</h3>
            {combinations2.map((combo, idx) => {
              const names = combo.map((e) => e.name);
              const key = pairKey(names[0], names[1]);
              const special = specialPairs[key];
              const ideology = special ? special.title : "Synthesis";
              const header = `${names.join(" + ")}: ${ideology};`;
              const description = buildContributionExplanation(combo);
              return (
                <p key={idx} className={s.virtueText}>
                  <strong>{header}</strong> {description}
                </p>
              );
            })}
          </div>
        </div>

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          <div className={s.virtueCard}>
            <h3 className={s.virtueTitle}>Three-Element Combinations</h3>
            {combinations3.map((combo, idx) => {
              const names = combo.map((e) => e.name);
              const key = comboKey(names);
              const special = specialTriples[key];
              const ideology = special ? special.title : "Synthesis";
              const header = `${names.join(" + ")}: ${ideology};`;
              const description = buildContributionExplanation(combo);
              return (
                <p key={idx} className={s.virtueText}>
                  <strong>{header}</strong> {description}
                </p>
              );
            })}
          </div>
        </div>

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          <div className={s.virtueCard}>
            <h3 className={s.virtueTitle}>Four-Element Combinations</h3>
            {combinations4.map((combo, idx) => {
              const names = combo.map((e) => e.name);
              const key = comboKey(names);
              const special = specialQuads[key];
              const ideology = special ? special.title : "Synthesis";
              const header = `${names.join(" + ")}: ${ideology};`;
              const description = buildContributionExplanation(combo);
              return (
                <p key={idx} className={s.virtueText}>
                  <strong>{header}</strong> {description}
                </p>
              );
            })}
          </div>
        </div>

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          <div className={s.virtueCard}>
            <h3 className={s.virtueTitle}>Five-Element Combinations</h3>
            {combinations5.map((combo, idx) => {
              const names = combo.map((e) => e.name);
              const key = comboKey(names);
              const special = specialQuints[key];
              const ideology = special ? special.title : "Synthesis";
              const header = `${names.join(" + ")}: ${ideology};`;
              const description = buildContributionExplanation(combo);
              return (
                <p key={idx} className={s.virtueText}>
                  <strong>{header}</strong> {description}
                </p>
              );
            })}
          </div>
        </div>
      </section>
    ),
    [combinations2, combinations3, combinations4, combinations5]
  );

  const renderActive = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return null;
    if (tab.isStatic) {
      return <>{StaticElements}</>;
    }
    const display = loadedText || "";
    const content = query ? highlight(display, query) : display;
    return (
      <section className={s.section}>
        <h2 className={s.sectionTitle}>{tab.label}</h2>
        <pre className={s.pre}>{content}</pre>
      </section>
    );
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>KONIVRER Lore</h1>
        <p className={s.subtitle}>
          Discover the rich history and mythology behind the cards
        </p>
      </div>

      <div className={s.tabsBar}>
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`${s.tabButton} ${
              activeTab === t.id ? s.tabActive : ""
            }`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.content}>{renderActive()}</div>
    </div>
  );
};
