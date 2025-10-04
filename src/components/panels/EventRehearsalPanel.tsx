import React, { useState } from "react";
import { useSimStore } from "../../stores/simStore";
import { EventService } from "../../services/eventService";

export const EventRehearsalPanel: React.FC = () => {
  const { eventId, roundNumber, pairings, setEventInfo, setPairings } = useSimStore();
  const [eid, setEid] = useState(eventId || "test-event");
  const [rnd, setRnd] = useState(roundNumber || 1);

  const load = async () => {
    const list = await EventService.fetchPairings(eid, rnd);
    setEventInfo(eid, rnd);
    setPairings(list as any);
  };

  return (
    <div>
      <h4>Event Rehearsal</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={eid} onChange={(e) => setEid(e.target.value)} placeholder="Event ID" />
        <input type="number" min={1} value={rnd} onChange={(e) => setRnd(parseInt(e.target.value || "1", 10))} />
        <button onClick={load}>Load Pairings</button>
      </div>
      <div style={{ marginTop: 8, maxHeight: 220, overflow: "auto" }}>
        {(pairings || []).map((p) => (
          <div key={p.tableNumber} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "6px 0" }}>
            <span>Table {p.tableNumber}</span>
            <span>{p.playerA.name} vs {p.playerB.name} — {p.status}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>Use with the round clock to simulate event pacing.</div>
    </div>
  );
};
