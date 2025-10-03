import React, { useEffect, useMemo, useState } from "react";
import { useSimStore, SimPanel } from "../stores/simStore";
import { useKonivrverGameState } from "../hooks/useKonivrverGameState";
import type { GameState } from "../types/game";
import KonivrverDeckValidator from "../services/deckValidator";
import { EventService } from "../services/eventService";
import { SideboardPanel } from "./panels/SideboardPanel";
import { JudgeToolsPanel } from "./panels/JudgeToolsPanel";
import { EventRehearsalPanel } from "./panels/EventRehearsalPanel";
import { ScenarioIOPanel } from "./panels/ScenarioIOPanel";
import { MatchupMatrixPanel } from "./panels/MatchupMatrixPanel";

export const SimulatorOverlay: React.FC = () => {
  const {
    mode,
    setMode,
    clock,
    startClock,
    pauseClock,
    resetClock,
    tick,
    savedScenarios,
    activeScenarioId,
    saveScenario,
    deleteScenario,
    setActiveScenario,
    stats,
    setStats,
    activePanel,
    setActivePanel,
  } = useSimStore();

  const {
    gameState,
    exportScenario,
    loadScenario,
    resetScenario,
    nextPhase,
    drawCard,
  } = useKonivrverGameState();

  // clock ticking
  useEffect(() => {
    if (!clock.running) return;
    const t = setInterval(() => tick(), 1000);
    return () => clearInterval(t);
  }, [clock.running, tick]);

  const handleSaveScenario = () => {
    const s: GameState = exportScenario();
    saveScenario({ id: crypto.randomUUID(), name: `Scenario ${new Date().toLocaleString()}`, createdAt: Date.now(), gameState: s });
  };

  const handleLoadScenario = (id: string) => {
    const s = savedScenarios.find((x) => x.id === id);
    if (s) {
      loadScenario(s.gameState);
      setActiveScenario(id);
    }
  };

  const handleExportDecklist = () => {
    // create a naive export from current player's zones
    const p = gameState.players[gameState.currentPlayer];
    const all = Object.values(p.zones).flatMap((z) => z.cards);
    const text = all.map((c) => `${c.name}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "decklist.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleValidateDeck = () => {
    const p = gameState.players[gameState.currentPlayer];
    const all = Object.values(p.zones).flatMap((z) => z.cards);
    const flag = p.flag;
    const validation = KonivrverDeckValidator.validateDeck(all as any, flag as any);
    const summary = KonivrverDeckValidator.getDeckConstructionRules();
    alert([
      validation.isValid ? "Deck is valid." : "Deck is INVALID.",
      validation.errors.join("\n"),
      "\nWarnings:",
      validation.warnings.join("\n"),
      "\nRules:",
      summary,
    ].filter(Boolean).join("\n"));
  };

  const handleMonteCarlo = async () => {
    // simple monte carlo over opening hands - placeholder logic
    const ITER = 1000;
    const p = gameState.players[0];
    let mull = 0;
    let sumQuality = 0;
    let landCounts: number[] = [];
    for (let i = 0; i < ITER; i++) {
      const deck = [...p.zones.deck.cards];
      for (let j = deck.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [deck[j], deck[k]] = [deck[k], deck[j]];
      }
      const hand = deck.slice(0, 7);
      const lands = hand.filter((c) => (c.lesserType || "").toLowerCase().includes("resource")).length;
      const quality = Math.min(1, lands / 3);
      sumQuality += quality;
      landCounts.push(lands);
      if (lands < 1 || lands > 5) mull++;
    }
    const mean = landCounts.reduce((a, b) => a + b, 0) / landCounts.length;
    const stdev = Math.sqrt(
      landCounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / landCounts.length,
    );
    setStats({ iterations: ITER, avgOpeningHandQuality: sumQuality / ITER, mulliganRate: mull / ITER, landSpellBalance: { mean, stdev } });
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Top bar: modes + timers */}
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 8, pointerEvents: "auto" }}>
        <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
          <option value="practice">Practice</option>
          <option value="scrim">Scrim</option>
          <option value="rehearsal">Rehearsal</option>
        </select>
        <div style={{ background: "rgba(0,0,0,0.6)", color: "#fff", padding: "6px 10px", borderRadius: 8 }}>
          Round: {Math.floor(clock.roundSeconds / 60)}:{String(clock.roundSeconds % 60).padStart(2, "0")}
        </div>
        {!clock.running ? (
          <button onClick={startClock}>Start</button>
        ) : (
          <button onClick={pauseClock}>Pause</button>
        )}
        <button onClick={resetClock}>Reset</button>
      </div>

      {/* Right panel: scenarios and tools */}
      <div style={{ position: "absolute", top: 10, right: 10, width: 420, maxHeight: "90%", overflow: "auto", background: "rgba(0,0,0,0.7)", color: "#fff", padding: 12, borderRadius: 10, pointerEvents: "auto" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          {(["lab","sideboard","judge","event","scenario","matchup"] as SimPanel[]).map((p) => (
            <button key={p} style={{ background: activePanel===p?"#2b6cb0":"#444", color: "#fff", border: 0, padding: "6px 10px", borderRadius: 6 }} onClick={() => setActivePanel(p)}>
              {p}
            </button>
          ))}
        </div>
        <h3 style={{ marginTop: 0, textTransform: "capitalize" }}>{activePanel}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={handleSaveScenario}>Save Scenario</button>
          <button onClick={resetScenario}>Reset Scenario</button>
          <button onClick={handleValidateDeck}>Validate Deck</button>
          <button onClick={handleMonteCarlo}>Opening Hand Analysis</button>
          <button onClick={() => nextPhase()}>Advance Phase</button>
          <button onClick={() => drawCard()}>Draw</button>
          <button onClick={handleExportDeck}>Export Decklist</button>
        </div>

        {activePanel === "sideboard" && <SideboardPanel />}
        {activePanel === "judge" && <JudgeToolsPanel />}
        {activePanel === "event" && <EventRehearsalPanel />}
        {activePanel === "scenario" && <ScenarioIOPanel />}
        {activePanel === "matchup" && <MatchupMatrixPanel />}

        {activePanel === "lab" && (
        <div style={{ marginTop: 12 }}>
          <strong>Saved Scenarios</strong>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {savedScenarios
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((s) => (
                <li key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ opacity: 0.9 }}>{s.name}</span>
                  <span>
                    <button onClick={() => handleLoadScenario(s.id)}>Load</button>
                    <button onClick={() => deleteScenario(s.id)}>Delete</button>
                  </span>
                </li>
              ))}
          </ul>
        </div>
        )}

        {activePanel === "lab" && stats && (
          <div style={{ marginTop: 12 }}>
            <strong>Opening Hand Stats</strong>
            <div>Iterations: {stats.iterations}</div>
            <div>Avg Quality: {stats.avgOpeningHandQuality.toFixed(2)}</div>
            <div>Mulligan Rate: {(stats.mulliganRate * 100).toFixed(1)}%</div>
            <div>Land/Resource mean: {stats.landSpellBalance.mean.toFixed(2)} ± {stats.landSpellBalance.stdev.toFixed(2)}</div>
          </div>
        )}

        {activePanel === "lab" && (
        <div style={{ marginTop: 12 }}>
          <strong>Paper Event</strong>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Practice for paper—then register to play IRL.</div>
          <button onClick={() => alert("Event finder coming soon. This button will deep-link to paper events.")}>Find Paper Events</button>
        </div>
        )}

        <div style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
          Testing Only – Not a tournament client. Play in paper.
        </div>
      </div>
    </div>
  );
};
