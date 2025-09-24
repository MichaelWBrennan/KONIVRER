import React, { useEffect, useMemo, useRef, useState } from "react";
import * as s from "./lore.css.ts";

export const Lore: React.FC = () => {
  function ScrollShadow({ children }: { children: React.ReactNode }) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);
    const hintRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const wrap = wrapRef.current;
      const left = leftRef.current;
      const right = rightRef.current;
      const hint = hintRef.current;
      if (!wrap || !left || !right) return;

      const scroller = wrap.querySelector(
        `.${s.tableScroll}`,
      ) as HTMLElement | null;
      if (!scroller) return;

      const update = () => {
        const maxScroll = scroller.scrollWidth - scroller.clientWidth;
        const x = scroller.scrollLeft;
        const atStart = x <= 0;
        const atEnd = x >= maxScroll - 1;
        left.classList.toggle(s.scrollEdgeVisible, !atStart);
        right.classList.toggle(s.scrollEdgeVisible, !atEnd);
        if (hint) hint.style.display = maxScroll > 0 ? "inline-flex" : "none";
      };

      const onScroll = () => {
        update();
        if (hint) hint.style.display = "none";
      };

      update();
      scroller.addEventListener("scroll", onScroll, { passive: true });
      const ro = new ResizeObserver(update);
      ro.observe(scroller);
      return () => {
        scroller.removeEventListener("scroll", onScroll);
        try {
          ro.disconnect();
        } catch {}
      };
    }, []);

    return (
      <div ref={wrapRef} className={s.tableScrollWrap}>
        <div ref={leftRef} className={`${s.scrollEdge} ${s.scrollEdgeLeft}`} />
        <div
          ref={rightRef}
          className={`${s.scrollEdge} ${s.scrollEdgeRight}`}
        />
        {children}
        <div ref={hintRef} className={s.scrollHint} aria-hidden="true">
          ← drag →
        </div>
      </div>
    );
  }
  function TraitFooterAutoFit({ traits }: { traits: string[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      const inner = innerRef.current;
      if (!container || !inner) return;

      let rafId = 0;

      const fit = () => {
        const containerEl = containerRef.current;
        const innerEl = innerRef.current;
        if (!containerEl || !innerEl) return;

        // Clear any previous explicit size to measure baseline
        containerEl.style.removeProperty("--trait-font-size");

        // Determine baseline font size from first chip
        const firstChip = innerEl.querySelector("span");
        const baselinePx = firstChip
          ? parseFloat(window.getComputedStyle(firstChip).fontSize || "14")
          : parseFloat(
              window.getComputedStyle(document.documentElement).fontSize ||
                "16",
            ) * 0.9;

        const available = containerEl.clientWidth;
        const needed = innerEl.scrollWidth;
        if (needed <= available || !isFinite(needed) || needed === 0) {
          containerEl.style.removeProperty("--trait-font-size");
          return;
        }

        const minPx = 8; // readability floor
        let nextPx = Math.max(
          minPx,
          Math.floor(baselinePx * (available / needed) * 100) / 100,
        );
        containerEl.style.setProperty("--trait-font-size", `${nextPx}px`);

        // Verify and refine a few times if still overflowing
        let attempts = 0;
        while (
          attempts < 4 &&
          innerEl.scrollWidth > available &&
          nextPx > minPx
        ) {
          nextPx = Math.max(minPx, Math.floor(nextPx * 0.96 * 100) / 100);
          containerEl.style.setProperty("--trait-font-size", `${nextPx}px`);
          attempts++;
        }
      };

      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(fit);
      });

      ro.observe(container);
      ro.observe(inner);

      // Initial fit after mount
      rafId = requestAnimationFrame(fit);

      return () => {
        cancelAnimationFrame(rafId);
        try {
          ro.disconnect();
        } catch (err) {
          // ignore disconnect errors
        }
      };
    }, [traits.join("|")]);

    return (
      <div ref={containerRef} className={s.traitFooter}>
        <div ref={innerRef} style={{ display: "inline-flex", gap: 8 }}>
          {traits.map((t, i) => (
            <span key={`${t}-${i}`} className={s.traitChip}>
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  }
  // Tabs configuration: first tab is existing static content
  const tabs: {
    id: string;
    label: string;
    src?: string;
    sources?: string[];
    isStatic?: boolean;
  }[] = [
    { id: "elements", label: "Six Elements", isStatic: true },
    {
      id: "aether",
      label: "Aether Treatise",
    },
    {
      id: "cosmology",
      label: "Cosmology",
      sources: ["/assets/lore/worlds.txt", "/assets/lore/veil.txt"],
    },
    {
      id: "pantheons_species",
      label: "Pantheons & Species",
      sources: [
        "/assets/lore/ars_goetia.txt",
        "/assets/lore/mesopotamian.txt",
        "/assets/lore/shem.txt",
        "/assets/lore/remaining.txt",
        "/assets/lore/infernal.txt",
        "/assets/lore/human.txt",
        "/assets/lore/species.txt",
        "/assets/lore/origin.txt",
      ],
    },
    {
      id: "societies_eras",
      label: "Societies & Eras",
      sources: [
        "/assets/lore/societies.txt",
        "/assets/lore/prehistory.txt",
        "/assets/lore/three_ages.txt",
        "/assets/lore/classical.txt",
        "/assets/lore/abrahamism.txt",
        "/assets/lore/dharmism.txt",
        "/assets/lore/african.txt",
        "/assets/lore/wildfolkism.txt",
        "/assets/lore/hellenism.txt",
        "/assets/lore/taoism.txt",
        "/assets/lore/items_east.txt",
      ],
    },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [query, setQuery] = useState<string>("");
  const [loadedText, setLoadedText] = useState<string>("");
  const [contentByTab, setContentByTab] = useState<Record<string, string>>({});
  const requestIdRef = useRef(0);

  const labelForSrc: Record<string, string> = {
    "/assets/lore/societies.txt": "Societies & Eras",
    "/assets/lore/ars_goetia.txt": "Ars Goetia",
    "/assets/lore/mesopotamian.txt": "Hidden Mesopotamian Pantheon",
    "/assets/lore/shem.txt": "Shem HaMephoras (72 Angels)",
    "/assets/lore/remaining.txt": "Remaining (Archangels, etc.)",
    "/assets/lore/origin.txt": "Origin of Species: Mythological Clades",
    "/assets/lore/summoning.txt": "Summoning",
    "/assets/lore/elements_east.txt": "Elements (Eastern Flavor)",
    "/assets/lore/veil.txt": "The Shattered Veil",
    "/assets/lore/elements_west.txt": "Elements (Western Flavor)",
    "/assets/lore/worlds.txt": "Worlds & Lokas",
    "/assets/lore/aether.txt": "Aether Magic System",
    "/assets/lore/laws_history.txt": "Laws & Pre-History",
    "/assets/lore/ethics.txt": "Ethics Systems",
    "/assets/lore/taoism.txt": "Taoism (AIFNW)",
    "/assets/lore/items_east.txt": "Items (Eastern)",
    "/assets/lore/abrahamism.txt": "Abrahamism (IFNEW)",
    "/assets/lore/dharmism.txt": "Dharmism (AINEW)",
    "/assets/lore/african.txt": "African (IFNEW)",
    "/assets/lore/wildfolkism.txt": "Wildfolkism (AIFNE)",
    "/assets/lore/hellenism.txt": "Hellenism (AIFEW)",
    "/assets/lore/human.txt": "Human & Celestials",
    "/assets/lore/infernal.txt": "Infernal & Mythological",
    "/assets/lore/species.txt": "Species (Ogre, Dvergr, etc.)",
    "/assets/lore/language.txt": "Basik AnglΣ (Language)",
    "/assets/lore/alchemy.txt": "Alxemi (Alchemy)",
    "/assets/lore/prehistory.txt": "Pre-History",
    "/assets/lore/three_ages.txt": "Three Ages",
    "/assets/lore/classical.txt": "Classical Era",
  };

  useEffect(() => {
    const handler = (e: any) => setQuery(e.detail || "");
    window.addEventListener("lore-search", handler);
    return () => window.removeEventListener("lore-search", handler);
  }, []);

  useEffect(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab || tab.isStatic) {
      setLoadedText("");
      return;
    }

    const sources = tab.sources ?? (tab.src ? [tab.src] : []);
    if (!sources || sources.length === 0) {
      setLoadedText("");
      return;
    }

    // Serve from cache if available
    const cached = contentByTab[tab.id];
    if (cached) {
      setLoadedText(cached);
      return;
    }

    // Prepare for a new request and clear current content to avoid stale display
    setLoadedText("");
    const controller = new AbortController();
    const currentRequestId = ++requestIdRef.current;

    (async () => {
      try {
        const texts = await Promise.all(
          sources.map(async (src) => {
            try {
              const res = await fetch(src, { signal: controller.signal });
              if (!res.ok) {
                return `Content not found for ${
                  labelForSrc[src] ?? src
                }. Ensure file exists at ${src}.`;
              }
              return await res.text();
            } catch (e) {
              if ((e as any)?.name === "AbortError") return "";
              return `Failed to load content from ${src}: ${String(e)}`;
            }
          }),
        );

        const combined = sources
          .map((src, idx) => {
            const sectionLabel = labelForSrc[src] ?? src;
            const body = texts[idx] || "";
            return `=== ${sectionLabel} ===\n\n${body.trim()}`;
          })
          .join("\n\n");

        // Only update if this is the latest request and not aborted
        if (
          !controller.signal.aborted &&
          currentRequestId === requestIdRef.current
        ) {
          setLoadedText(combined);
          setContentByTab((prev: Record<string, string>) => ({
            ...prev,
            [tab.id]: combined,
          }));
        }
      } catch (err) {
        if (
          !controller.signal.aborted &&
          currentRequestId === requestIdRef.current
        ) {
          setLoadedText(`Failed to load content: ${String(err)}`);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [activeTab, contentByTab]);

  const highlight = (text: string, q: string): React.ReactNode => {
    if (!q) return text;
    try {
      const parts = text.split(
        new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`, "gi"),
      );
      return parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className={s.highlight}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
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
    names: ElementDefinition["name"][],
  ): FactionEntry {
    const key = comboKey(names);
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
    const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
        `</svg>`,
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

  function joinOxford(items: string[]): string {
    const list = items.filter(Boolean);
    if (list.length === 0) return "";
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
  }

  function uniqueCaseInsensitive(values: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of values) {
      const key = v.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(v);
      }
    }
    return out;
  }

  function collectTraits(combo: ElementDefinition[]): string[] {
    return uniqueCaseInsensitive(
      combo.flatMap((e) => [e.traitX, e.traitY]).filter(Boolean),
    );
  }

  const factionBlurbs: Record<string, string> = {
    // Alliances and leagues (two-color)
    "Hanseatic League":
      "was a federation of northern towns that organized Baltic–North Sea trade through kontors in Bruges, London, Bergen, and Novgorod; convoy protection, staple rights, and collective embargoes secured privileges and stabilized commerce.",
    "Auld Alliance":
      "was a Franco–Scottish compact coordinating diplomacy and mutual military support against England; joint campaigns and reciprocal privileges sustained resilience across the late Middle Ages.",
    "Lombard League":
      "was a coalition of northern Italian communes defending communal liberties; after victory at Legnano, the Peace of Constance secured self‑government under a negotiated imperial framework.",
    "Delian League":
      "was an Aegean maritime coalition whose tribute and fleet coordination under Athenian leadership turned cooperative defense into durable systems of revenue, garrisons, and sea control.",
    "Swiss Confederacy":
      "bound alpine cantons by oath for mutual defense; militia levies, pacts, and negotiated autonomy resisted Habsburg and Burgundian pressure.",
    "Kalmar Union":
      "linked Denmark, Norway, and Sweden under one monarch; common fleets and councils were balanced by local estates bargaining over taxation, law, and succession.",
    "Arte della Lana (Florence)":
      "supervised quality, labor, and exports in Florence's textile economy; ordinances, seals of approval, and contracted workshops scaled production while policing standards.",
    "Arte della Calimala (Florence)":
      "imported and finished luxury textiles; account books, quality marks, and patronage networks underwrote long‑distance trade and civic projects.",
    "Worshipful Company of Mercers":
      "was a London livery company dealing in fine textiles; charters, ward governance, and wardens' courts regulated members while financing civic works.",
    "Worshipful Company of Goldsmiths":
      "set assay and hallmarking standards for precious metals; testing and hallmarks at Goldsmiths' Hall safeguarded trust in coin and plate.",
    "Brotherhood of Blackheads":
      "united unmarried merchants in Livonian cities such as Riga and Tallinn; arsenals, credit, and processions entwined commerce with urban defense and ceremony.",
    "Company of Merchant Adventurers":
      "organized the English cloth export trade to the Low Countries; staples, membership rules, and consular courts lowered transaction costs abroad.",
    "League of the Public Weal":
      "was a coalition of great nobles in France that forced concessions from Louis XI; compacts, fortified holdings, and shifting alliances bargained with the crown.",
    "Rhenish League of Towns":
      "mounted joint measures along the Rhine against robber barons and disorder; toll agreements and armed escorts made riverine commerce safer.",
    "Amalfi–Pisa Maritime Pact":
      "evokes the standardized sea laws, convoying, and notarial practice developed among Italian maritime republics; merchants moved under recognizable contracts across the central Mediterranean.",

    // Clans and families (three-color)
    "Clan MacDonald (Clan Donald)":
      "built sea power in the Hebrides through galleys, tribute, and arbitration; island councils and fosterage bound a far‑flung lordship of the Isles.",
    "Clan Campbell":
      "expanded in Argyll via charters, sheriffships, and strategic marriages; office‑holding and legal instruments translated into territorial consolidation.",
    "House of Habsburg":
      "used dynastic marriages, fiefs, and imperial elections to assemble a mosaic of jurisdictions; chancelleries, diets, and tax grants stitched them into workable rule.",
    "House of Plantagenet":
      "professionalized government through royal inquests, itinerant justice, and the Exchequer; levies and revenues sustained wars across the Channel.",
    "House of Capet":
      "grew royal authority from an Île‑de‑France base via church alliances, consistent justice, and the steady enlargement of the demesne.",
    "House of Valois":
      "reformed fiscal and military institutions during the Hundred Years' War—standing companies and the taille—helping the crown recover and centralize.",
    "House of Trastámara":
      "leveraged frontier war and union of crowns; councils, military orders, and new fiscal tools advanced Iberian consolidation.",
    "House of Lancaster":
      "governed through broad coalitions, commissions of array, and council rule to steady a throne founded on usurpation.",
    "House of York":
      "pursued administrative streamlining, urban alliances, and household affinity networks to strengthen royal authority during civil strife.",
    "House of Bourbon":
      "built regional power through marriage, patronage, and service to the crown; landed jurisdiction and kinship ties created a durable bloc.",
    "Minamoto Clan":
      "established the Kamakura bakufu; shugo and jitō posts embedded military governance and estate control in the provinces.",
    "Taira Clan":
      "combined court patronage, maritime trade, and provincial governorships to finance a brief hegemony before defeat in the Genpei War.",
    "Fujiwara Clan":
      "dominated Heian politics through regency and marriage; mansion estates and letters culture anchored elite authority.",
    "Yamato Clan":
      "spearheaded early state formation with kofun‑era authority, ritual, and district administration in the Japanese heartland.",
    "Borjigin Clan":
      "organized steppe confederation under Chinggisid law; relay stations, decimal organization, and legal codes governed Eurasian expanse.",
    "Banu Hashim":
      "held custodianship in Mecca and kin leadership that later dynasties traced; sacral prestige and mediation shaped authority.",
    "Banu Umayya (Umayyad)":
      "built early imperial administration with Arabic chancelleries, coinage reform, and provincial governors integrating a vast realm.",
    "Tuareg Confederations":
      "protected caravans and controlled oases; clan assemblies and customary law ordered mobile life along Saharan routes.",
    Ainu: "balanced hunting, river‑sea trade, and ritual exchange with neighbors; councils and alliances governed relations across the north.",
    Cherokee:
      "organized town councils and mound‑centered civic life; matrilineal clans and diplomacy linked river valleys before European contact.",

    // Dominions, coalitions, syndicates (four-color)
    "Crown of Aragon":
      "was a Mediterranean composite monarchy whose merchants, consulates, and naval escorts structured trade from Barcelona to Sicily; the Consolat de Mar codified maritime practice.",
    "Crown of Castile":
      "mobilized the Mesta's sheep‑walks, municipal fueros, and cortes taxation; frontier settlement and law shaped a continental domain.",
    "Polish–Lithuanian Union":
      "bound nobles in personal unions; regional diets and negotiated privileges created a shared political nation across vast territories.",
    "Grand Duchy of Lithuania":
      "administered Europe's largest state with Ruthenian chancery practice, layered vassalage, and later comprehensive Lithuanian Statutes.",
    "Novgorod Republic":
      "relied on veche assemblies, elected posadniks, and treaty‑backed trade with the north until annexation by Muscovy.",
    "Monastic State of the Teutonic Order":
      "built castles, planted towns with German law, and taxed Baltic trade; defeat at Grunwald curbed expansion but institutions endured.",
    "Mamluk Sultanate":
      "governed through an elite military caste, iqta revenues, and caravan protection; victory at Ayn Jalut and merchant diplomacy kept Cairo central.",
    "Delhi Sultanate":
      "held the Indo‑Gangetic plain with land‑revenue reform, fortified capitals, and active market and coinage management.",
    "Sultanate of Malacca":
      "ran a bustling entrepôt with harbor masters, tariffs, and legal codes ordering multiethnic trade; diplomacy linked the straits to Asia's monsoon routes.",
    "Golden Horde":
      "leveraged yarlik charters, tribute from Rus principalities, and river routes; coinage tied the khanate into Eurasian commerce.",
    "Timurid State":
      "fostered a Persianate renaissance in Samarkand and Herat; conquest financed monumental architecture and arts patronage.",
    "Italian League (1454)":
      "stabilized Italy after Lodi through balance‑of‑power pacts; resident ambassadors and condottieri enforced negotiated peace.",
    "Medici Bank":
      "used branch networks, bills of exchange, and meticulous risk books to fund princes and wool; cultural patronage advertised solvency.",
    "House of Fugger":
      "controlled Central European copper and extended credit to emperors; ledgers and partnerships scaled mining and finance.",
    "Kingdom of Hungary":
      "developed royal mining towns and a professional Black Army under Matthias Corvinus; border forts and revenue reforms strengthened the realm.",

    // Empires (five-color)
    "Holy Roman Empire":
      "coordinated a patchwork of princes and cities through electors, imperial courts, and circles; diets mediated law, tolls, and defense with limited central force.",
    "Ottoman Empire":
      "organized a multilingual empire by timar land grants, devşirme recruiting, and a palace bureaucracy; the capture of Constantinople crowned maritime and land strategy.",
    "Ming Dynasty":
      "restored agrarian registers and the examination system; state granaries, salt monopolies, and oceanic expeditions displayed administrative reach.",
    "Aztec Empire":
      "structured the Triple Alliance around tribute, markets, and ritual warfare; imperial oversight of pochteca and provinces sustained expansion.",
    "Inca Empire":
      "integrated highland and coast via the Qhapaq Ñan road, mit'a labor drafts, and quipu accounting under a centrally directed commonwealth.",
    "Songhai Empire":
      "projected power from Gao and Timbuktu with river fleets and customs houses; Islamic scholarship and trans‑Saharan trade funded authority.",
  };

  function getFactionBlurb(name: string): string {
    return (
      factionBlurbs[name] ||
      `${name} leveraged institutions, law, and networks to pursue durable aims across its domain.`
    );
  }

  // New: split narrative into two explicit paragraphs for standardized layout
  function buildIdeologyParagraph(
    combo: ElementDefinition[],
    ideologyTitle: string,
  ): string {
    const traits = collectTraits(combo).map((t) => t.toLowerCase());
    const themes = combo.map((e) => summarize(e.definition).toLowerCase());
    const themeLine = joinOxford(themes);
    const traitLine = joinOxford(traits.slice(0, 4));
    return `${ideologyTitle} is a blend of ${themeLine}. In practice, it leans on ${traitLine}.`;
  }

  function buildFactionParagraph(
    faction: FactionEntry,
    ideologyTitle: string,
    combo: ElementDefinition[],
  ): string {
    const blurb = getFactionBlurb(faction.name);
    const line = buildFactionIdeologyLine(faction, ideologyTitle, combo);
    return `${faction.name} ${blurb} ${line}`;
  }

  function buildFactionIdeologyLine(
    faction: FactionEntry,
    ideology: string,
    combo: ElementDefinition[],
  ): string {
    void faction;
    const traits = collectTraits(combo).map((t) => t.toLowerCase());
    const listed = joinOxford(traits.slice(0, 4));
    return `It reflects ${ideology.toLowerCase()} by bringing together ${listed}.`;
  }

  // ------------------ Cohesive descriptions and trait rendering ------------------

  function renderTraitRows(combo: ElementDefinition[]): React.ReactNode {
    return <TraitFooterAutoFit traits={combo.map((e) => e.traitX)} />;
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
            src="/assets/lore/six-divine-elements.webp"
            alt="Six Divine Elements wheel showing Aether, Air, Fire, Earth, Water, and Nether"
            loading="lazy"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const img = e.currentTarget;
              img.src = "/assets/lore/six-divine-elements.png";
              img.onerror = () => {
                img.src = "/assets/card-back-new.webp";
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
                <TraitFooterAutoFit traits={[aether.traitX, aether.traitY]} />
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Air — Adaptation</h3>
                <p className={s.virtueText}>
                  <em>
                    Do what works; help and teach while things change. You like
                    trying, learning, and guiding others.
                  </em>
                </p>
                <TraitFooterAutoFit traits={[air.traitX, air.traitY]} />
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
                <TraitFooterAutoFit traits={[fire.traitX, fire.traitY]} />
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Earth — Integrity</h3>
                <p className={s.virtueText}>
                  <em>
                    Do what is fair; set clear rules and check that things are
                    done well. You keep order and make sure standards are met.
                  </em>
                </p>
                <TraitFooterAutoFit traits={[earth.traitX, earth.traitY]} />
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Water — Potential</h3>
                <p className={s.virtueText}>
                  <em>
                    See what could be; bring pieces together to open new paths.
                    You connect ideas and people to discover new possibilities.
                  </em>
                </p>
                <TraitFooterAutoFit traits={[water.traitX, water.traitY]} />
              </div>
              <div className={s.virtueCard}>
                <h3 className={s.virtueTitle}>Nether — Capability</h3>
                <p className={s.virtueText}>
                  <em>
                    Plan how things can work; design steps that make ideas real.
                    You build skills and plans that help everyone do more.
                  </em>
                </p>
                <TraitFooterAutoFit traits={[nether.traitX, nether.traitY]} />
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
            const header = names.join(" + ");
            const ideologyParagraph = buildIdeologyParagraph(combo, ideology);
            const factionParagraph = buildFactionParagraph(
              faction,
              ideology,
              combo,
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name,
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>
                  <strong>Ideology:</strong> {ideology}
                </p>
                <p className={s.virtueText}>
                  <strong>Faction:</strong> {faction.name}
                </p>
                <p className={s.virtueText}>{ideologyParagraph}</p>
                <p className={s.virtueText}>{factionParagraph}</p>
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
              names as ElementDefinition["name"][],
            );
            const header = names.join(" + ");
            const ideologyParagraph = buildIdeologyParagraph(combo, ideology);
            const factionParagraph = buildFactionParagraph(
              faction,
              ideology,
              combo,
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name,
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>
                  <strong>Ideology:</strong> {ideology}
                </p>
                <p className={s.virtueText}>
                  <strong>Faction:</strong> {faction.name}
                </p>
                <p className={s.virtueText}>{ideologyParagraph}</p>
                <p className={s.virtueText}>{factionParagraph}</p>
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
              names as ElementDefinition["name"][],
            );
            const header = names.join(" + ");
            const ideologyParagraph = buildIdeologyParagraph(combo, ideology);
            const factionParagraph = buildFactionParagraph(
              faction,
              ideology,
              combo,
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name,
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>
                  <strong>Ideology:</strong> {ideology}
                </p>
                <p className={s.virtueText}>
                  <strong>Faction:</strong> {faction.name}
                </p>
                <p className={s.virtueText}>{ideologyParagraph}</p>
                <p className={s.virtueText}>{factionParagraph}</p>
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
              names as ElementDefinition["name"][],
            );
            const header = names.join(" + ");
            const ideologyParagraph = buildIdeologyParagraph(combo, ideology);
            const factionParagraph = buildFactionParagraph(
              faction,
              ideology,
              combo,
            );
            return (
              <div key={key} className={s.virtueCard}>
                <div
                  className={s.watermark}
                  style={{
                    backgroundImage: buildFactionWatermarkBackground(
                      faction.name,
                    ),
                  }}
                />
                <h3 className={s.virtueTitle}>{header}</h3>
                <p className={s.virtueText}>
                  <strong>Ideology:</strong> {ideology}
                </p>
                <p className={s.virtueText}>
                  <strong>Faction:</strong> {faction.name}
                </p>
                <p className={s.virtueText}>{ideologyParagraph}</p>
                <p className={s.virtueText}>{factionParagraph}</p>
                {renderTraitRows(combo)}
              </div>
            );
          })}
        </div>
      </section>
    ),
    [combinations2, combinations3, combinations4, combinations5],
  );

  // ------------------ Cosmology & Magic structured rendering ------------------
  function renderCosmologyStructured(): React.ReactNode {
    const h = (text: string) => (query ? highlight(text, query) : text);

    const paragraphs: string[] = [
      "This is a straight‑forward look at how the world is built and how it behaves.",
      "There are three layers: Overworld (clear and elevated), Midworld (everyday life), and Underworld (quiet and reflective). They stack like pages in one book and occasionally touch at the edges.",
      "The Veil is the boundary between layers. Think of it less as a wall and more as a safety protocol that keeps regular life and the dead from overlapping by default.",
      "What changed: on the Night of Saints, the Veilstone cracked. Since then, thin places—called crossings—are more common and a little easier to notice.",
      "Crossings appear where meaning is heavy: where apologies are made, promises are kept, old rites are observed, and records are accurate. The crack didn’t remove rules; it made the rules visible.",
      "Sky patterns correlate with stability. Certain alignments tend to steady crossings; others make them noisy. None of this forces outcomes, but it does shape the odds—more like tides than commands.",
      "Practical rule of thumb: if you are studying a crossing, measure and log repeats. Two observations suggest a pattern; three give you a rule.",
      "Local examples: in Valea Căpcănești the air tastes metallic near the new moon; Castle Bran throws a faint second shadow at dawn in midsummer; the Carpathian Forest hums when mountain winds intersect; at the Veilstone Abyss, compasses drift and never fully settle.",
      "Quick safety notes for observers: introduce yourself, state your purpose, keep your promises small, and record what you do. Strong emotion and exhaustion distort readings; show up rested and precise.",
      "If you remember nothing else: three layered worlds, one Veil, occasional crossings. The Break made the edges easier to see, not easier to exploit.",
    ];

    return (
      <section className={`${s.section} ${s.journalPage}`}>
        <h2 className={`${s.sectionTitle} ${s.journalHeader}`}>Cosmology</h2>
        <div className={s.journalRule} />
        {(() => {
          const quickFacts: string[] = [
            "Three layers: Overworld, Midworld, Underworld.",
            "The Veil is a boundary; the Break made crossings more visible, not lawless.",
            "Crossings cluster where apologies are made, promises kept, rites observed, and records are accurate.",
            "Sky alignments change stability—think tides, not commands.",
            "Method: log repeats. Two observations suggest a pattern; three make a rule.",
            "Safety: introduce yourself, state purpose, keep promises small, write everything down.",
          ];
          return (
            <div className={s.journalMarginNote}>
              <strong>{h("Quick facts:")}</strong>
              <ul>
                {quickFacts.map((b, i) => (
                  <li key={i}>{h(b)}</li>
                ))}
              </ul>
            </div>
          );
        })()}
        <div className={s.journalColumns}>
          {paragraphs.map((p, i) => {
            if (i === 0 && typeof p === "string" && p.length > 0) {
              const first = p.charAt(0);
              const rest = p.slice(1);
              return (
                <p key={i} className={s.journalText}>
                  <span className={s.journalDropcap}>{h(first as string)}</span>
                  {h(rest)}
                </p>
              );
            }
            return (
              <p key={i} className={s.journalText}>
                {h(p)}
              </p>
            );
          })}
        </div>
      </section>
    );
  }

  function renderAetherTreatise(): React.ReactNode {
    const h = (text: string) => (query ? highlight(text, query) : text);

    const introParts: string[] = [
      "Canon Aetheris Medicus, compiled in the year fifteen‑hundred after the shattering of the Veil, gathers the safe doctrine of breath and flow from monasteries and bazaars between the Pillars and the Sunrise. What follows is a physician's book, not a conjurer's: it treats the coursing of Aether in the body, the gates by which it gathers and loosens, and the lawful means to set it right. The compilers write in a world without conquering Rome or imperial churches; traditions stand side by side rather than being folded into one another.",
      "Names differ yet the matter is one. Levantine sages speak of ruach and neshamah; Dharmic lineages call it prāṇa bound in nāḍīs and cakras; Daoist physicians speak of qì along the meridians as yin and yang balance; Hellenic asklepiads teach pneûma through humors and temperaments; along Kemet's river it is sekhem and ka; in the Northlands and isles, awen and önd; across the great belt of Africa, àṣẹ or nyama. We call all these Aether when it concerns flesh.",
      "Aether is examined by sight, pulse, and pressure; corrected by breath, touch, needle, heat, unguent, food, posture, prayer, and song. The art is conservative: prefer what loosens gently before what burns. Hunger, grief newly kindled, and crowds seeking marvels are bad times to work.",
    ];
    const intro = introParts.join("\n\n");

    const doctrineRows: Array<[string, string, string, string]> = [
      [
        "Levantine Temple Ways",
        "Ruach/Neshamah",
        "Gates of heart and throat; right hand for covenant, left for memory",
        "Prayer and psalmody; anointing oils; calendar fasts",
      ],
      [
        "Dharmic Lineages",
        "Prāṇa",
        "Nāḍīs (iḍā, piṅgalā, suṣumṇā); seven lamps (cakras)",
        "Breath‑disciplines, seats and locks; herbs warm or cool the doṣas",
      ],
      [
        "Dao Traditions",
        "Qì",
        "Meridians; source, well, river, stream, and sea points",
        "Acupressure/needling; moxa; seasonal diet; quiet standing",
      ],
      [
        "Hellenic Asklepeion",
        "Pneûma",
        "Organs as furnaces; humors carry heat and motion",
        "Balancing hot/cold, dry/moist; pulse, baths, simples",
      ],
      [
        "Kemetic Houses",
        "Sekhem/Ka",
        "Djed pillar along the spine; bright gates at crown, collarbones, wrists",
        "Perfumed unguents, natron washes; hymns and measured breath",
      ],
      [
        "West African Lineages",
        "Vital force (àṣẹ, nyama)",
        "Lines of kin and place; crown, palms, soles as bright gates",
        "Invocation, rhythm, palm‑oils, smoke; elders' blessing",
      ],
      [
        "Celto‑Germanic Ways",
        "Awen/Önd",
        "Hollows where wind pools: nape, kidneys, knee crooks; tongue and tooth placements guide breath",
        "Offerings, bone‑charms, seiðr song; walking rites",
      ],
    ];

    const lamps: Array<[string, string, string, string]> = [
      [
        "Crown (Lamp of Kings)",
        "Fontanelle, midline",
        "Suṣumṇā/DU meets REN; ancestral line joins",
        "Brightening; wastes if grief is sealed",
      ],
      [
        "Brow (Lamp of Counsel)",
        "Between the eyes",
        "Idā/Piṅgalā braid; Yin/Yang cross",
        "Clarity; scatters with excessive vigil or false lights",
      ],
      [
        "Throat (Lamp of Oaths)",
        "Above the notch",
        "Sea of qì; gate of covenant breath",
        "Gives voice; tightens with swallowed words",
      ],
      [
        "Heart (Lamp of Mercy)",
        "Sternum's center",
        "Great meeting of channels; seat of intention",
        "Warms limbs; chills with resentment",
      ],
      [
        "Solar (Lamp of Resolve)",
        "Below xiphoid",
        "Middle burner; river of food‑fire",
        "Digests worries; flares with pride, sinks with shame",
      ],
      [
        "Navel (Lamp of Stewardship)",
        "At the umbilicus",
        "Sea of blood; srotas distribute",
        "Stores strength; leaks with over‑giving",
      ],
      [
        "Root (Lamp of Keeping)",
        "Perineal gate",
        "Gate of essence; ming‑men behind",
        "Holds life; freezes with fear, bleeds with excess heat",
      ],
    ];

    const complaints: Array<[string, string, string, string]> = [
      [
        "Head wind (scatter‑thought, moving pain)",
        "Qì ascends unruly; iḍā/piṅgalā unpaced",
        "Press brow gate; warm feet; lengthen exhale; avoid bitter at night",
        "Do not needle crown in grief's first three days",
      ],
      [
        "Chest tightness (unshed speech)",
        "Throat/heart gates bound by withheld word",
        "Rub sesame with thyme over sternum; sing psalm or mantra; open windows",
        "No sharp heat if tongue is dry and red",
      ],
      [
        "Cold hands, quick anger",
        "Fire trapped at solar; earth drained at navel",
        "Ginger decoction; knead the thenar well; walk until sweat pearls",
        "Avoid strong purges in winter",
      ],
      [
        "Night‑terrors (fright wind)",
        "Root gate startled; essence scattering",
        "Warm milk with nutmeg; bind an iron button at ankle gate; ancestor prayer",
        "Leave children un-needled save for gentle touch",
      ],
    ];

    const glossary: string[] = [
      "Gate — a place on the body where Aether pools and can be persuaded",
      "Lamp — a deep basin along the spine that governs many gates",
      "Burners — upper, middle, lower hearths that cook breath into blood",
      "Tonify — to invite Aether in; Sedate — to cool an excess",
    ];

    return (
      <section className={`${s.section} ${s.folioPage}`}>
        <h2 className={s.folioHeader}>Canon Aetheris Medicus (c. 1500)</h2>
        <p className={s.folioSubhead}>
          {h(
            "A cross‑Eurasian manual on the flow of Aether in flesh: breath, channels, lamps, and lawful remedies",
          )}
        </p>
        <div className={s.folioColumns}>
          <div className={s.folioText}>{h(intro)}</div>
        </div>
        <div className={s.folioRule} />

        <div className={s.diagramCard}>
          <ScrollShadow>
            <div className={s.tableScroll}>
              <table className={s.matrix}>
                <thead>
                  <tr>
                    <th className={s.matrixTh}>Tradition</th>
                    <th className={s.matrixTh}>Name for Aether</th>
                    <th className={s.matrixTh}>Channels and Gates</th>
                    <th className={s.matrixTh}>Balancings</th>
                  </tr>
                </thead>
                <tbody>
                  {doctrineRows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={`${i}-${j}`} className={s.matrixTd}>
                          {h(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollShadow>
        </div>

        <div className={s.folioMarginNote}>
          <strong>{h("Maxims:")}</strong>
          <ul>
            <li>
              {h(
                "Begin with breath and posture; next with touch and food; only then with needle or fire.",
              )}
            </li>
            <li>
              {h("Do not treat during rage, fasting, or fresh mourning.")}
            </li>
            <li>
              {h(
                "Where traditions differ in word, reconcile in the patient: follow what steadies their breath.",
              )}
            </li>
          </ul>
        </div>

        <div className={s.diagramCard}>
          <ScrollShadow>
            <div className={s.tableScroll}>
              <table className={s.matrix}>
                <thead>
                  <tr>
                    <th className={s.matrixTh}>Seven Lamps</th>
                    <th className={s.matrixTh}>Seat</th>
                    <th className={s.matrixTh}>Crossings</th>
                    <th className={s.matrixTh}>Clinical Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {lamps.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={`${i}-${j}`} className={s.matrixTd}>
                          {h(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollShadow>
        </div>

        <div className={s.diagramCard}>
          <div className={s.tableScroll}>
            <table className={s.matrix}>
              <thead>
                <tr>
                  <th className={s.matrixTh}>Common Complaint</th>
                  <th className={s.matrixTh}>Reading</th>
                  <th className={s.matrixTh}>Gentle Treatment</th>
                  <th className={s.matrixTh}>Caution</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={`${i}-${j}`} className={s.matrixTd}>
                        {h(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.folioMarginNote}>
          <strong>{h("Glossary:")}</strong>
          <ul>
            {glossary.map((g, i) => (
              <li key={i}>{h(g)}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const renderActive = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return null;
    if (tab.isStatic) {
      return <>{StaticElements}</>;
    }
    const display = loadedText || "";
    if (tab.id === "cosmology" && display) {
      return renderCosmologyStructured();
    }
    if (tab.id === "aether") {
      return renderAetherTreatise();
    }
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
