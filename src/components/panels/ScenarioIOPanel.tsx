import React, { useRef } from "react";
import { useKonivrverGameState } from "../../hooks/useKonivrverGameState";

export const ScenarioIOPanel: React.FC = () => {
  const { exportScenario, loadScenario } = useKonivrverGameState();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const data = exportScenario();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scenario.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importJson = async (f: File) => {
    const text = await f.text();
    const data = JSON.parse(text);
    loadScenario(data);
  };

  return (
    <div>
      <h4>Scenario Import/Export</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={exportJson}>Export JSON</button>
        <button onClick={() => fileRef.current?.click()}>Import JSON</button>
        <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importJson(f);
        }} />
      </div>
    </div>
  );
};
