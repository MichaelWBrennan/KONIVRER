import React, { useMemo, useState } from "react";
import { PdfViewer } from "./PdfViewer";

export const Rules: React.FC = () => {
  const documents = useMemo(
    () =>
      [
        { label: "Rules", value: "/assets/konivrer-rules.pdf" },
        { label: "Tournament Rules", value: "/assets/konivrer-tournament-rules.pdf" },
        { label: "Code of Conduct", value: "/assets/konivrer-code-of-conduct.pdf" },
      ],
    [],
  );

  const [selectedUrl, setSelectedUrl] = useState<string>(documents[0].value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label htmlFor="rules-doc-select" style={{ fontWeight: 600 }}>
          Document
        </label>
        <select
          id="rules-doc-select"
          aria-label="Select rules document"
          value={selectedUrl}
          onChange={(e) => setSelectedUrl(e.target.value)}
        >
          {documents.map((doc) => (
            <option key={doc.value} value={doc.value}>
              {doc.label}
            </option>
          ))}
        </select>
        <a href={selectedUrl} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
      <PdfViewer url={selectedUrl} />
    </div>
  );
};
