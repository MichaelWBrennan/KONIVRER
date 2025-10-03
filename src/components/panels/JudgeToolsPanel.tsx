import React, { useState } from "react";
import { searchRules } from "../../services/rulesParser";
import { EventService } from "../../services/eventService";
import { useSimStore } from "../../stores/simStore";

export const JudgeToolsPanel: React.FC = () => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(() => searchRules("phases"));
  const { lastJudgeTicketId, setLastJudgeTicketId } = useSimStore();

  return (
    <div>
      <h4>Judge Tools</h4>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rules..." />
        <button onClick={() => setResults(searchRules(q))}>Search</button>
        <button
          onClick={async () => {
            const r = await EventService.callJudge();
            if (r.ok) setLastJudgeTicketId(r.ticketId!);
          }}
        >
          Call Judge
        </button>
      </div>
      {lastJudgeTicketId && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Ticket: {lastJudgeTicketId}</div>
      )}
      <div style={{ marginTop: 10, maxHeight: 200, overflow: "auto" }}>
        {results.map((r) => (
          <div key={r.section} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "6px 0" }}>
            <strong>{r.section}. {r.title}</strong>
            <div style={{ fontSize: 12, whiteSpace: "pre-wrap", opacity: 0.9 }}>{r.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
