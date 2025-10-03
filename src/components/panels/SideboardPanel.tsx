import React, { useEffect } from "react";
import { useSimStore } from "../../stores/simStore";

export const SideboardPanel: React.FC = () => {
  const { clock, sideboardRunning, startSideboard, pauseSideboard, resetSideboard, tickSideboard } = useSimStore();

  useEffect(() => {
    if (!sideboardRunning) return;
    const t = setInterval(() => tickSideboard(), 1000);
    return () => clearInterval(t);
  }, [sideboardRunning, tickSideboard]);

  return (
    <div>
      <h4>Sideboard Rehearsal</h4>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ background: "rgba(0,0,0,0.4)", padding: "6px 10px", borderRadius: 8, color: "#fff" }}>
          Sideboard: {Math.floor(clock.sideboardSeconds / 60)}:{String(clock.sideboardSeconds % 60).padStart(2, "0")}
        </div>
        {!sideboardRunning ? (
          <button onClick={startSideboard}>Start</button>
        ) : (
          <button onClick={pauseSideboard}>Pause</button>
        )}
        <button onClick={resetSideboard}>Reset</button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
        Practice boarding in/out under real time constraints. Capture pre/post-board plans.
      </div>
    </div>
  );
};
