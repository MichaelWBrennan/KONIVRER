import React, { useEffect, useMemo, useState } from "react";
import { PdfViewer } from "./PdfViewer";

export const Rules: React.FC = () => {
  const documents = useMemo(
    () =>
      [
        { label: "Basic Rules", value: "/assets/konivrer-rules.pdf" },
        { label: "Tournament Rules", value: "/assets/konivrer-tournament-rules.pdf" },
        { label: "Code of Conduct", value: "/assets/konivrer-code-of-conduct.pdf" },
      ],
    [],
  );

  const [selectedUrl, setSelectedUrl] = useState<string>(documents[0].value);

  // Listen for selection changes from the global SearchBar dropdown
  useEffect(() => {
    const onRulesDocChange = (e: Event) => {
      const url = (e as CustomEvent<string>).detail;
      if (typeof url === "string") setSelectedUrl(url);
    };
    window.addEventListener("rules-doc-change", onRulesDocChange);
    return () => window.removeEventListener("rules-doc-change", onRulesDocChange);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <PdfViewer url={selectedUrl} />
    </div>
  );
};
