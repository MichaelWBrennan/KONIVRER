import React, { useState } from "react";
import type { Card } from "../../types/game";
import { useKonivrverGameState } from "../../hooks/useKonivrverGameState";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let j = a.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [a[j], a[k]] = [a[k], a[j]];
  }
  return a;
}

export const MatchupMatrixPanel: React.FC = () => {
  const { gameState } = useKonivrverGameState();
  const [iters, setIters] = useState(200);
  const [result, setResult] = useState<{ mull: number; avg: number } | null>(null);

  const run = () => {
    const p = gameState.players[0];
    const base = [...p.zones.deck.cards];
    if (base.length < 7) {
      alert("Need a deck in the deck zone (>=7 cards).");
      return;
    }
    let mull = 0, sum = 0;
    for (let i = 0; i < iters; i++) {
      const hand = shuffle(base).slice(0, 7);
      const resources = hand.filter((c) => (c.lesserType || "").toLowerCase().includes("resource")).length;
      sum += Math.min(1, resources / 3);
      if (resources < 1 || resources > 5) mull++;
    }
    setResult({ mull, avg: sum / iters });
  };

  return (
    <div>
      <h4>Matchup Matrix (Baseline)</h4>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>Iterations</label>
        <input type="number" min={50} step={50} value={iters} onChange={(e) => setIters(parseInt(e.target.value || "200", 10))} />
        <button onClick={run}>Run</button>
      </div>
      {result && (
        <div style={{ marginTop: 8 }}>
          <div>Mulligans: {result.mull} / {iters} ({((result.mull/iters)*100).toFixed(1)}%)</div>
          <div>Avg Opening Quality: {result.avg.toFixed(2)}</div>
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>Extend with multiple decks and sideboard plans to build a full matrix.</div>
    </div>
  );
};
