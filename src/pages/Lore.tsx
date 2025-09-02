import React, { useEffect, useMemo, useState } from "react";
import * as s from "./lore.css.ts";

export const Lore: React.FC = () => {
	// Tabs configuration: first tab is existing static content
	const tabs: { id: string; label: string; src?: string; isStatic?: boolean }[] = [
		{ id: "elements", label: "Six Elements (Core)", isStatic: true },
		{ id: "societies", label: "Societies & Eras", src: "/assets/lore/societies.txt" },
		{ id: "ars_goetia", label: "Ars Goetia", src: "/assets/lore/ars_goetia.txt" },
		{ id: "mesopotamian", label: "Hidden Mesopotamian Pantheon", src: "/assets/lore/mesopotamian.txt" },
		{ id: "shem", label: "Shem HaMephoras (72 Angels)", src: "/assets/lore/shem.txt" },
		{ id: "remaining", label: "Remaining (Archangels, etc.)", src: "/assets/lore/remaining.txt" },
		{ id: "origin", label: "Origin of Species: Mythological Clades", src: "/assets/lore/origin.txt" },
		{ id: "summoning", label: "Summoning", src: "/assets/lore/summoning.txt" },
		{ id: "elements_east", label: "Elements (Eastern Flavor)", src: "/assets/lore/elements_east.txt" },
		{ id: "veil", label: "The Shattered Veil", src: "/assets/lore/veil.txt" },
		{ id: "elements_west", label: "Elements (Western Flavor)", src: "/assets/lore/elements_west.txt" },
		{ id: "worlds", label: "Worlds & Lokas", src: "/assets/lore/worlds.txt" },
		{ id: "aether", label: "Aether Magic System", src: "/assets/lore/aether.txt" },
		{ id: "laws_history", label: "Laws & Pre-History", src: "/assets/lore/laws_history.txt" },
		{ id: "ethics", label: "Ethics Systems", src: "/assets/lore/ethics.txt" },
		{ id: "taoism", label: "Taoism (AIFNW)", src: "/assets/lore/taoism.txt" },
		{ id: "items_east", label: "Items (Eastern)", src: "/assets/lore/items_east.txt" },
		{ id: "abrahamism", label: "Abrahamism (IFNEW)", src: "/assets/lore/abrahamism.txt" },
		{ id: "dharmism", label: "Dharmism (AINEW)", src: "/assets/lore/dharmism.txt" },
		{ id: "african", label: "African (IFNEW)", src: "/assets/lore/african.txt" },
		{ id: "wildfolkism", label: "Wildfolkism (AIFNE)", src: "/assets/lore/wildfolkism.txt" },
		{ id: "hellenism", label: "Hellenism (AIFEW)", src: "/assets/lore/hellenism.txt" },
		{ id: "human", label: "Human & Celestials", src: "/assets/lore/human.txt" },
		{ id: "infernal", label: "Infernal & Mythological", src: "/assets/lore/infernal.txt" },
		{ id: "species", label: "Species (Ogre, Dvergr, etc.)", src: "/assets/lore/species.txt" },
		{ id: "language", label: "Basik AnglΣ (Language)", src: "/assets/lore/language.txt" },
		{ id: "alchemy", label: "Alxemi (Alchemy)", src: "/assets/lore/alchemy.txt" },
		{ id: "prehistory", label: "Pre-History", src: "/assets/lore/prehistory.txt" },
		{ id: "three_ages", label: "Three Ages", src: "/assets/lore/three_ages.txt" },
		{ id: "classical", label: "Classical Era", src: "/assets/lore/classical.txt" },
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
		const src = tab.src;
		(async () => {
			try {
				const res = await fetch(src);
				if (!res.ok) {
					setLoadedText(`Content not found for ${tab.label}. Ensure file exists at ${src}.`);
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
			const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`, "gi"));
			return parts.map((part, i) =>
				part.toLowerCase() === q.toLowerCase() ? (
					<mark key={i} className={s.highlight}>{part}</mark>
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

	const wheelOrder: ElementDefinition["name"][] = [
		"Water",
		"Aether",
		"Air",
		"Fire",
		"Nether",
		"Earth",
	];

	type Relations = {
		allies: ElementDefinition["name"][];
		enemy: ElementDefinition["name"];
	};

	const relationsByElement: Record<ElementDefinition["name"], Relations> =
		wheelOrder.reduce((acc, elementName, index) => {
			const left = wheelOrder[(index - 1 + wheelOrder.length) % wheelOrder.length];
			const right = wheelOrder[(index + 1) % wheelOrder.length];
			const opposite = wheelOrder[(index + wheelOrder.length / 2) % wheelOrder.length];
			acc[elementName] = { allies: [left, right], enemy: opposite };
			return acc;
		}, {} as Record<ElementDefinition["name"], Relations>);

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

	const StaticElements = useMemo(
		() => (
			<section className={s.section}>
				<div className={s.diagramContainer}>
					<img
						className={s.diagramImage}
						src="/assets/lore/six-divine-elements.png"
						alt="Six Divine Elements wheel showing Aether, Air, Fire, Earth, Water, and Nether"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "/assets/card-back-new.png";
						}}
					/>
				</div>
				<div className={s.virtuesGrid}>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Aether — Principle</h3>
						<p className={s.virtueText}>
							Do what is right; act clearly and quickly when things are confusing. You care about what is right and take clear action.
						</p>
					</div>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Air — Adaptation</h3>
						<p className={s.virtueText}>
							Do what works; help and teach while things change. You like trying, learning, and guiding others.
						</p>
					</div>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Fire — Aspiration</h3>
						<p className={s.virtueText}>
							Work toward a better world; care for and defend others as you build. You dream big and protect people while moving forward.
						</p>
					</div>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Earth — Integrity</h3>
						<p className={s.virtueText}>
							Do what is fair; set clear rules and check that things are done well. You keep order and make sure standards are met.
						</p>
					</div>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Water — Potential</h3>
						<p className={s.virtueText}>
							See what could be; bring pieces together to open new paths. You connect ideas and people to discover new possibilities.
						</p>
					</div>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Nether — Capability</h3>
						<p className={s.virtueText}>
							Plan how things can work; design steps that make ideas real. You build skills and plans that help everyone do more.
						</p>
					</div>
				</div>

				<div className={s.virtuesGrid} style={{ marginTop: 16 }}>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Color Alignment</h3>
						<p className={s.virtueText}>
							Like a sixfold color pie, each person, faction, and card aligns to one or more elements. Adjacent elements are allies; the element directly across the wheel is its enemy.
						</p>
					</div>
				</div>

				<div className={s.virtuesGrid} style={{ marginTop: 16 }}>
					{wheelOrder.map((name) => {
						const rel = relationsByElement[name];
						return (
							<div key={name} className={s.virtueCard}>
								<h3 className={s.virtueTitle}>{name} — Allies & Enemy</h3>
								<p className={s.virtueText}>
									<strong>Allies:</strong> {rel.allies[0]} and {rel.allies[1]}
								</p>
								<p className={s.virtueText}>
									<strong>Enemy:</strong> {rel.enemy}
								</p>
							</div>
						);
					})}
				</div>

				<div className={s.virtuesGrid} style={{ marginTop: 16 }}>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Adjacent Pairs</h3>
						<p className={s.virtueText}>
							Water + Aether: Rainbow — Quickly put things together to spark new ideas.
						</p>
						<p className={s.virtueText}>
							Aether + Air: Aurora — Smart, flexible action that shows the way.
						</p>
						<p className={s.virtueText}>
							Air + Fire: Flare — Action that inspires and keeps people safe.
						</p>
						<p className={s.virtueText}>
							Fire + Nether: Char — Careful planning that turns into bold, helpful action.
						</p>
						<p className={s.virtueText}>
							Nether + Earth: Compost — Careful plans improved by review become strong and steady.
						</p>
						<p className={s.virtueText}>
							Earth + Water: Mud — Helpful limits that help new things grow safely.
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
							const title = special ? `${names[0]} + ${names[1]} — ${special.title}` : `${names[0]} + ${names[1]}`;
							const description = special ? special.description : buildDefaultDescription(combo);
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
								<strong>{combo.map((e) => e.name).join(" + ")}</strong>: {buildDefaultDescription(combo)}
							</p>
						))}
					</div>
				</div>

				<div className={s.virtuesGrid} style={{ marginTop: 16 }}>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Four-Element Combinations</h3>
						{combinations4.map((combo, idx) => (
							<p key={idx} className={s.virtueText}>
								<strong>{combo.map((e) => e.name).join(" + ")}</strong>: {buildDefaultDescription(combo)}
							</p>
						))}
					</div>
				</div>

				<div className={s.virtuesGrid} style={{ marginTop: 16 }}>
					<div className={s.virtueCard}>
						<h3 className={s.virtueTitle}>Five-Element Combinations</h3>
						{combinations5.map((combo, idx) => (
							<p key={idx} className={s.virtueText}>
								<strong>{combo.map((e) => e.name).join(" + ")}</strong>: {buildDefaultDescription(combo)}
							</p>
						))}
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
			return (
				<>
					<section className={s.section}>
						<h2 className={s.sectionTitle}>The World of KONIVRER</h2>
						<p className={s.text}>
							Discover the rich history and mythology behind the cards
						</p>
					</section>
					{StaticElements}
				</>
			);
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
						className={`${s.tabButton} ${activeTab === t.id ? s.tabActive : ""}`}
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
