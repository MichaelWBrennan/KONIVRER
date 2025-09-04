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
    traitX: string; // first operative trait from the diagram
    traitY: string; // second operative trait from the diagram
  };

  const elementDefinitions: ElementDefinition[] = [
    {
      name: "Aether",
      epithet: "Principle",
      definition:
        "Do what is right; act clearly and quickly when things are confusing.",
      stance: "You care about what is right and take clear action.",
      traitX: "Improvise",
      traitY: "Expedite",
    },
    {
      name: "Air",
      epithet: "Adaptation",
      definition: "Do what works; help and teach while things change.",
      stance: "You like trying, learning, and guiding others.",
      traitX: "Educate",
      traitY: "Guide",
    },
    {
      name: "Fire",
      epithet: "Aspiration",
      definition:
        "Work toward a better world; care for and defend others as you build.",
      stance: "You dream big and protect people while moving forward.",
      traitX: "Provide",
      traitY: "Protect",
    },
    {
      name: "Earth",
      epithet: "Integrity",
      definition:
        "Do what is fair; set clear rules and check that things are done well.",
      stance: "You keep order and make sure standards are met.",
      traitX: "Supervise",
      traitY: "Inspect",
    },
    {
      name: "Water",
      epithet: "Potential",
      definition: "See what could be; bring pieces together to open new paths.",
      stance: "You connect ideas and people to discover new possibilities.",
      traitX: "Assemble",
      traitY: "Impose",
    },
    {
      name: "Nether",
      epithet: "Capability",
      definition:
        "Plan how things can work; design steps that make ideas real.",
      stance: "You build skills and plans that help everyone do more.",
      traitX: "Plan",
      traitY: "Design",
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

  // Color pie ordering for directional trait selection (deprecated after cohesive rewrite)
  // const colorPieOrder: ElementDefinition["name"][] = [
  //   "Air",
  //   "Aether",
  //   "Water",
  //   "Earth",
  //   "Nether",
  //   "Fire",
  // ];

  // const traitOrientation: Record<
  //   ElementDefinition["name"],
  //   { cw: "X" | "Y"; ccw: "X" | "Y" }
  // > = {
  //   Aether: { cw: "Y", ccw: "X" },
  //   Air: { cw: "X", ccw: "Y" },
  //   Water: { cw: "Y", ccw: "X" },
  //   Earth: { cw: "X", ccw: "Y" },
  //   Nether: { cw: "X", ccw: "Y" },
  //   Fire: { cw: "X", ccw: "Y" },
  // };

  // function getDirection(
  //   from: ElementDefinition["name"],
  //   to: ElementDefinition["name"]
  // ): "cw" | "ccw" { /* deprecated */ }

  // ------------------ Faction assignment (pre-1500 CE) ------------------
  type FactionEntry = { type: string; name: string };

  const twoColorFactions: FactionEntry[] = [
    { type: "Alliance", name: "Hanseatic League" },
    { type: "Alliance", name: "Auld Alliance" },
    { type: "Alliance", name: "Lombard League" },
    { type: "Alliance", name: "Delian League" },
    { type: "Alliance", name: "Swiss Confederacy" },
    { type: "Alliance", name: "Kalmar Union" },
    { type: "Guild", name: "Arte della Lana (Florence)" },
    { type: "Guild", name: "Arte della Calimala (Florence)" },
    { type: "Guild", name: "Worshipful Company of Mercers" },
    { type: "Guild", name: "Worshipful Company of Goldsmiths" },
    { type: "Guild", name: "Brotherhood of Blackheads" },
    { type: "Guild", name: "Company of Merchant Adventurers" },
    { type: "Alliance", name: "League of the Public Weal" },
    { type: "Alliance", name: "Rhenish League of Towns" },
    { type: "Alliance", name: "Amalfi–Pisa Maritime Pact" },
  ];

  const threeColorFactions: FactionEntry[] = [
    { type: "Clan", name: "Clan MacDonald (Clan Donald)" },
    { type: "Clan", name: "Clan Campbell" },
    { type: "Family", name: "House of Habsburg" },
    { type: "Family", name: "House of Plantagenet" },
    { type: "Family", name: "House of Capet" },
    { type: "Family", name: "House of Valois" },
    { type: "Family", name: "House of Trastámara" },
    { type: "Family", name: "House of Lancaster" },
    { type: "Family", name: "House of York" },
    { type: "Family", name: "House of Bourbon" },
    { type: "Clan", name: "Minamoto Clan" },
    { type: "Clan", name: "Taira Clan" },
    { type: "Clan", name: "Fujiwara Clan" },
    { type: "Clan", name: "Yamato Clan" },
    { type: "Clan", name: "Borjigin Clan" },
    { type: "Clan", name: "Banu Hashim" },
    { type: "Clan", name: "Banu Umayya (Umayyad)" },
    { type: "Tribe", name: "Tuareg Confederations" },
    { type: "Tribe", name: "Ainu" },
    { type: "Tribe", name: "Cherokee" },
  ];

  const fourColorFactions: FactionEntry[] = [
    { type: "Dominion", name: "Crown of Aragon" },
    { type: "Dominion", name: "Crown of Castile" },
    { type: "Coalition", name: "Polish–Lithuanian Union" },
    { type: "Dominion", name: "Grand Duchy of Lithuania" },
    { type: "Dominion", name: "Novgorod Republic" },
    { type: "Dominion", name: "Monastic State of the Teutonic Order" },
    { type: "Dominion", name: "Mamluk Sultanate" },
    { type: "Dominion", name: "Delhi Sultanate" },
    { type: "Dominion", name: "Sultanate of Malacca" },
    { type: "Dominion", name: "Golden Horde" },
    { type: "Dominion", name: "Timurid State" },
    { type: "Coalition", name: "Italian League (1454)" },
    { type: "Syndicate", name: "Medici Bank" },
    { type: "Syndicate", name: "House of Fugger" },
    { type: "Dominion", name: "Kingdom of Hungary" },
  ];

  const fiveColorFactions: FactionEntry[] = [
    { type: "Empire", name: "Holy Roman Empire" },
    { type: "Empire", name: "Ottoman Empire" },
    { type: "Empire", name: "Ming Dynasty" },
    { type: "Empire", name: "Aztec Empire" },
    { type: "Empire", name: "Inca Empire" },
    { type: "Empire", name: "Songhai Empire" },
  ];

  function hashKeyToIndex(key: string, modulo: number): number {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return h % modulo;
  }

  function getFactionForCombo(
    names: ElementDefinition["name"]
  ): FactionEntry {
    const key = comboKey(names as string[]);
    const size = names.length;
    if (size === 2)
      return twoColorFactions[hashKeyToIndex(key, twoColorFactions.length)];
    if (size === 3)
      return threeColorFactions[hashKeyToIndex(key, threeColorFactions.length)];
    if (size === 4)
      return fourColorFactions[hashKeyToIndex(key, fourColorFactions.length)];
    return fiveColorFactions[hashKeyToIndex(key, fiveColorFactions.length)];
  }

  // --------------- Faction watermark helpers and ideology line ---------------
  function slugifyFactionName(name: string): string {
    const normalized = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  const factionSymbolOverrides: Record<string, string> = {
    // Alliances and leagues
    "hanseatic-league":
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/CoA_Hanseatic_League.svg",
    "delian-league":
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Owl_of_Athena_with_olive_sprig_and_moon.svg",
    "swiss-confederacy":
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Coat_of_arms_of_Switzerland.svg",
    "kalmar-union":
      "https://upload.wikimedia.org/wikipedia/commons/e/e2/Union_of_Crowns_of_Calmar_Arms_%28fictional%29.svg",
    // Dominions/States/Empires
    "crown-of-aragon":
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Aragon_Arms.svg",
    "crown-of-castile":
      "https://upload.wikimedia.org/wikipedia/commons/4/4e/Coat_of_Arms_of_the_Crown_of_Castile_%281471-1492%29.svg",
    "polish-lithuanian-union":
      "https://upload.wikimedia.org/wikipedia/commons/5/5f/Coat_of_Arms_of_the_Polish%E2%80%93Lithuanian_Union.svg",
    "monastic-state-of-the-teutonic-order":
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Coa_Orden_Teutonico.svg",
    "mamluk-sultanate":
      "https://upload.wikimedia.org/wikipedia/commons/8/82/Blason_Mamelouk.svg",
    "delhi-sultanate":
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/Delhi_sultanate_Flag.svg",
    "sultanate-of-malacca":
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Coat_of_arms_of_Malacca_Sultanate.svg",
    "golden-horde":
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/Golden_Horde_tamga.svg",
    "timurid-state":
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/Timurid_Tamgha.svg",
    "grand-duchy-of-lithuania":
      "https://upload.wikimedia.org/wikipedia/commons/8/86/Coat_of_Arms_of_the_Grand_Duchy_of_Lithuania.svg",
    "novgorod-republic":
      "https://upload.wikimedia.org/wikipedia/commons/5/5b/Coat_of_Arms_of_Novgorod.svg",
    "kingdom-of-hungary":
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Coat_of_arms_of_Hungary.svg",
    "holy-roman-empire":
      "https://upload.wikimedia.org/wikipedia/commons/5/5f/Quaternio_eagle.svg",
    "ottoman-empire":
      "https://upload.wikimedia.org/wikipedia/commons/1/19/Coat_of_arms_of_the_Ottoman_Empire.svg",
    "ming-dynasty":
      "https://upload.wikimedia.org/wikipedia/commons/3/31/Coat_of_arms_of_the_Ming_Dynasty.svg",
    "aztec-empire":
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Coyolxauhqui_stone_%28National_Museum_of_Anthropology%29_%28Mexico_City%29.svg",
    "inca-empire":
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Sun_of_May_%28Argentina%29.svg",
    "songhai-empire":
      "https://upload.wikimedia.org/wikipedia/commons/5/5c/Songhai_Symbol.svg",
    // Families/Clans (representative heraldry)
    "house-of-habsburg":
      "https://upload.wikimedia.org/wikipedia/commons/7/70/Coat_of_arms_of_the_House_of_Habsburg.svg",
    "house-of-plantagenet":
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Arms_of_the_Kingdom_of_England_%281199-1340%29.svg",
    "house-of-capet":
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Arms_of_the_Kingdom_of_France_%28Ancien%29.svg",
    "house-of-valois":
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Coat_of_Arms_of_the_House_of_Valois.svg",
    "house-of-trastámara":
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Coat_of_Arms_Trastamara.svg",
    "house-of-lancaster":
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Badge_of_the_House_of_Lancaster.svg",
    "house-of-york":
      "https://upload.wikimedia.org/wikipedia/commons/f/fb/White_Rose_of_York.svg",
    "house-of-bourbon":
      "https://upload.wikimedia.org/wikipedia/commons/6/65/Coat_of_arms_of_Bourbon-France.svg",
    "clan-macdonald-clan-donald":
      "https://upload.wikimedia.org/wikipedia/commons/4/49/Clan_Donald_crest.svg",
    "clan-campbell":
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/Clan_member_crest_badge_-_Clan_Campbell.svg",
    "minamoto-clan":
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Minamoto_mon.svg",
    "taira-clan":
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Mon_of_the_Taira_clan.svg",
    "fujiwara-clan":
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Mon_of_the_Fujiwara_clan.svg",
    "yamato-clan":
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Japanese_Crest_Yamato.svg",
    "borjigin-clan":
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Soyombo.svg",
    "banu-hashim":
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/Seal_of_Muhammad.svg",
    "banu-umayya-umayyad":
      "https://upload.wikimedia.org/wikipedia/commons/4/4f/Coat_of_arms_of_Umayyad_Caliphate.svg",
  };

  function buildDynamicInitialsDataUrl(name: string): string {
    const initials = name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 3)
      .toUpperCase();
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>` +
        `<defs><radialGradient id='g' cx='50%' cy='50%'><stop offset='0%' stop-color='#ffffff'/><stop offset='100%' stop-color='#e6eef7'/></radialGradient></defs>` +
        `<rect width='100%' height='100%' fill='url(#g)'/>` +
        `<text x='50%' y='54%' text-anchor='middle' font-size='72' font-family='serif' fill='#2c3e50' opacity='0.35'>${initials}</text>` +
      `</svg>`
    );
    return `url("data:image/svg+xml;utf8,${svg}")`;
  }

  function buildFactionWatermarkBackground(name: string): string {
    const slug = slugifyFactionName(name);
    const local = `/assets/factions/${slug}.svg`;
    const override = factionSymbolOverrides[slug];
    const dynamic = buildDynamicInitialsDataUrl(name);
    const urls: string[] = [];
    if (override) urls.push(`url(${override})`);
    urls.push(`url(${local})`);
    urls.push(dynamic);
    return urls.join(", ");
  }

  function buildFactionIdeologyLine(
    faction: FactionEntry,
    ideology: string,
    names: string[]
  ): string {
    const lowered = names.map((n) => n.toLowerCase()).join(", ");
    return `${faction.name} represents ${ideology.toLowerCase()} through ${lowered}.`;
  }

  // ------------------ Cohesive descriptions and trait rendering ------------------
  function buildCohesiveParagraph(
    combo: ElementDefinition[],
    ideologyTitle: string
  ): string {
    const names = combo.map((e) => e.name);
    const epithets = combo.map((e) => e.epithet.toLowerCase());
    const stances = combo.map((e) => summarize(e.definition).toLowerCase());
    const joinedNames = names.join(", ").replace(/, ([^,]*)$/, ", and $1");
    const joinedEpithets = epithets
      .join(", ")
      .replace(/, ([^,]*)$/, ", and $1");
    const joinedStances = stances.join(", ").replace(/, ([^,]*)$/, ", and $1");
    return `${ideologyTitle} weaves ${joinedEpithets} through ${joinedNames}, turning ${joinedStances} into one coordinated practice.`;
  }

  function renderTraitRows(combo: ElementDefinition[]): React.ReactNode {
    // Single-line footer of primary traits for 2+ combinations
    return (
      <div className={s.traitFooter}>
        {combo.map((e) => (
          <span key={e.name} className={s.traitChip}>
            {e.traitX}
          </span>
        ))}
      </div>
    );
  }

  // Deprecated helper retained for reference; not used after cohesive rewrite
  // function pickTraitForPair(element: ElementDefinition, partnerName: ElementDefinition["name"]): string { /* replaced by renderTraitRows */ }

  // Deprecated helper retained for reference; not used after cohesive rewrite
  // function buildPairContributionExplanation(
  //   a: ElementDefinition,
  //   b: ElementDefinition
  // ): React.ReactNode { /* replaced by buildCohesiveParagraph */ }

  const specialPairs: Record<string, { title: string; description: string }> = {
    // Aether pairs
    [pairKey("Aether", "Air")]: {
      title: "Pragmatism",
      description:
        "Air educates and adapts; Aether improvises with moral clarity. Together they enact practical, principle-anchored change.",
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
        "Aether expedites right action; Water assembles people and pieces. Together they build inclusive systems that unify in practice.",
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
        "Air guides; Fire protects. Together they lead at the front, safeguarding while steering.",
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
        "Nether designs capabilities; Fire provides energy and drive. Together they mobilize designed efforts that deliver.",
    },

    // Earth pairs
    [pairKey("Earth", "Water")]: {
      title: "Conservationism",
      description:
        "Water imposes limits; Earth supervises standards. Together they steward resources with firm guardrails and steady oversight.",
    },
    [pairKey("Earth", "Nether")]: {
      title: "Institutionalism",
      description:
        "Earth inspects; Nether plans. Together they construct accountable institutions with verifiable steps.",
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

  // Deprecated helper retained for reference; not used after cohesive rewrite
  // function buildContributionExplanation(combo: ElementDefinition[]): React.ReactNode { /* replaced by buildCohesiveParagraph */ }

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
            loading="lazy"
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
        {(() => {
          const aether = elementDefinitions.find((e) => e.name === "Aether")!;
          const air = elementDefinitions.find((e) => e.name === "Air")!;
          const fire = elementDefinitions.find((e) => e.name === "Fire")!;
          const earth = elementDefinitions.find((e) => e.name === "Earth")!;
          const water = elementDefinitions.find((e) => e.name === "Water")!;
          const nether = elementDefinitions.find((e) => e.name === "Nether")!;
          return (
            <div className={s.virtuesGrid}>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Aether — Principle</h3>
                <p className={s.virtueText}>
                  <em>
                    Do what is right; act clearly and quickly when things are
                    confusing. You care about what is right and take clear
                    action.
                  </em>
                </p>
                <div className={s.traitRow}>
                  <span className={s.traitChip}>{aether.traitX}</span>
                  <span className={s.traitChip}>{aether.traitY}</span>
                </div>
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Air — Adaptation</h3>
                <p className={s.virtueText}>
                  <em>
                    Do what works; help and teach while things change. You like
                    trying, learning, and guiding others.
                  </em>
                </p>
                <div className={s.traitRow}>
                  <span className={s.traitChip}>{air.traitX}</span>
                  <span className={s.traitChip}>{air.traitY}</span>
                </div>
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Fire — Aspiration</h3>
                <p className={s.virtueText}>
                  <em>
                    Work toward a better world; care for and defend others as
                    you build. You dream big and protect people while moving
                    forward.
                  </em>
                </p>
                <div className={s.traitRow}>
                  <span className={s.traitChip}>{fire.traitX}</span>
                  <span className={s.traitChip}>{fire.traitY}</span>
                </div>
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Earth — Integrity</h3>
                <p className={s.virtueText}>
                  <em>
                    Do what is fair; set clear rules and check that things are
                    done well. You keep order and make sure standards are met.
                  </em>
                </p>
                <div className={s.traitRow}>
                  <span className={s.traitChip}>{earth.traitX}</span>
                  <span className={s.traitChip}>{earth.traitY}</span>
                </div>
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Water — Potential</h3>
                <p className={s.virtueText}>
                  <em>
                    See what could be; bring pieces together to open new paths.
                    You connect ideas and people to discover new possibilities.
                  </em>
                </p>
                <div className={s.traitRow}>
                  <span className={s.traitChip}>{water.traitX}</span>
                  <span className={s.traitChip}>{water.traitY}</span>
                </div>
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Nether — Capability</h3>
                <p className={s.virtueText}>
                  <em>
                    Plan how things can work; design steps that make ideas real.
                    You build skills and plans that help everyone do more.
                  </em>
                </p>
                <div className={s.traitRow}>
                  <span className={s.traitChip}>{nether.traitX}</span>
                  <span className={s.traitChip}>{nether.traitY}</span>
                </div>
              </div>
            </div>
          );
        })()}
        {/* end single-element cards */}

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          {combinations2.map((combo) => {
            const [e1, e2] = combo;
            const names = [e1.name, e2.name] as ElementDefinition["name"][];
            const key = pairKey(names[0], names[1]);
            const special = specialPairs[key];
            const ideology = special ? special.title : "Synthesis";
            const faction = getFactionForCombo(names);
            const header = `${names.join(" + ")} — ${faction.name} (${ideology})`;
            const description = special?.description
              ? special.description
              : buildCohesiveParagraph(combo, ideology);
            const ideologyLine = buildFactionIdeologyLine(
              faction,
              ideology,
              names as string[]
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>{description}</p>
                <p className={s.virtueText}>
                  <em>{ideologyLine}</em>
                </p>
                {renderTraitRows(combo)}
              </div>
            );
          })}
        </div>

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          {combinations3.map((combo) => {
            const names = combo.map((e) => e.name);
            const key = comboKey(names);
            const special = specialTriples[key];
            const ideology = special ? special.title : "Synthesis";
            const faction = getFactionForCombo(
              names as ElementDefinition["name"][]
            );
            const header = `${names.join(" + ")} — ${faction.name} (${ideology})`;
            const description = buildCohesiveParagraph(combo, ideology);
            const ideologyLine = buildFactionIdeologyLine(
              faction,
              ideology,
              names as string[]
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>{description}</p>
                <p className={s.virtueText}>
                  <em>{ideologyLine}</em>
                </p>
                {renderTraitRows(combo)}
              </div>
            );
          })}
        </div>

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          {combinations4.map((combo) => {
            const names = combo.map((e) => e.name);
            const key = comboKey(names);
            const special = specialQuads[key];
            const ideology = special ? special.title : "Synthesis";
            const faction = getFactionForCombo(
              names as ElementDefinition["name"][]
            );
            const header = `${names.join(" + ")} — ${faction.name} (${ideology})`;
            const description = buildCohesiveParagraph(combo, ideology);
            const ideologyLine = buildFactionIdeologyLine(
              faction,
              ideology,
              names as string[]
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>{description}</p>
                <p className={s.virtueText}>
                  <em>{ideologyLine}</em>
                </p>
                {renderTraitRows(combo)}
              </div>
            );
          })}
        </div>

        <div className={s.virtuesGrid} style={{ marginTop: 16 }}>
          {combinations5.map((combo) => {
            const names = combo.map((e) => e.name);
            const key = comboKey(names);
            const special = specialQuints[key];
            const ideology = special ? special.title : "Synthesis";
            const faction = getFactionForCombo(
              names as ElementDefinition["name"][]
            );
            const header = `${names.join(" + ")} — ${faction.name} (${ideology})`;
            const description = buildCohesiveParagraph(combo, ideology);
            const ideologyLine = buildFactionIdeologyLine(
              faction,
              ideology,
              names as string[]
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>{description}</p>
                <p className={s.virtueText}>
                  <em>{ideologyLine}</em>
                </p>
                {renderTraitRows(combo)}
              </div>
            );
          })}
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
