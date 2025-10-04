import React, { useMemo } from "react";
import { useSimStore } from "../../stores/simStore";
import { CardSearch } from "../CardSearch";
import { resolveCardImageUrls } from "../../utils/cardImages";
import type { Card } from "../../types/game";
import { useKonivrverGameState } from "../../hooks/useKonivrverGameState";

export const BuilderPanel: React.FC = () => {
  const {
    builderDeck,
    builderName,
    setBuilderName,
    addToBuilder,
    removeFromBuilder,
    clearBuilder,
    saveCurrentDeck,
    savedDecks,
    loadSavedDeck,
    deleteSavedDeck,
  } = useSimStore();
  const { resetScenario, replaceZone } = useKonivrverGameState();

  const counts = useMemo(() => ({ total: builderDeck.length }), [builderDeck]);

  return (
    <div>
      <h4>Deck Builder</h4>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input value={builderName} onChange={(e) => setBuilderName(e.target.value)} placeholder="Deck name" />
        <button onClick={() => saveCurrentDeck()}>Save</button>
        <button onClick={() => clearBuilder()}>Clear</button>
        <span style={{ opacity: 0.8, fontSize: 12 }}>Cards: {counts.total}</span>
        <button
          onClick={() => {
            // Export plain-text list for paper deck submission
            const text = builderDeck.map((c) => c.name).join("\n");
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${builderName || "deck"}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }}
        >
          Export decklist
        </button>
        <button
          onClick={() => {
            // In-engine: reset to preGame and load deck into player's library
            resetScenario();
            // small defer to ensure reset applied before replace
            setTimeout(() => {
              // Ensure objects match sim card type; reuse existing fields
              const cards: Card[] = builderDeck.map((c) => ({
                ...c,
                isSelected: false,
                isTapped: false,
              }));
              replaceZone(0, "deck", cards);
            }, 0);
          }}
        >
          Load to simulator
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ maxHeight: 260, overflow: "auto", background: "rgba(0,0,0,0.3)", padding: 6, borderRadius: 6 }}>
          <strong>Search</strong>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Click cards to add to deck (max 1 copy per card).</div>
          <CardSearch onCardSelect={(c: any) => addToBuilder(c as Card)} />
        </div>
        <div style={{ maxHeight: 260, overflow: "auto", background: "rgba(0,0,0,0.3)", padding: 6, borderRadius: 6 }}>
          <strong>Current Deck</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 6 }}>
            {builderDeck.map((card) => (
              <div key={card.id} style={{ position: "relative" }}>
                <img src={resolveCardImageUrls(card as any).imgSrc} alt={card.name} style={{ width: "100%", borderRadius: 6 }} />
                <button style={{ position: "absolute", top: 4, right: 4 }} onClick={() => removeFromBuilder(card.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Saved Decks</strong>
        <div style={{ maxHeight: 140, overflow: "auto" }}>
          {(savedDecks || []).slice().sort((a, b) => b.updatedAt - a.updatedAt).map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "6px 0" }}>
              <span>{d.name}</span>
              <span>
                <button onClick={() => loadSavedDeck(d.id)}>Load</button>
                <button onClick={() => deleteSavedDeck(d.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
