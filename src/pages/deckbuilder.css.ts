import { style } from "@vanilla-extract/css";

export const container: any = style({
  padding: "2rem",
  maxWidth: 1400,
  margin: "0 auto",
});
export const header: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1rem",
});
export const actions: any = style({ display: "flex", gap: "0.5rem" });
export const content: any = style({
  display: "grid",
  gridTemplateColumns: "360px 1fr 360px",
  gap: "1rem",
  alignItems: "start",
});

export const listPanel: any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const panelHeader: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  marginBottom: "0.5rem",
});
export const deckGrid: any = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "0.5rem",
});
export const deckCard: any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "0.75rem",
  cursor: "pointer",
});
export const deckCardSelected: any = style({
  outline: "2px solid var(--accent-color)",
});
export const deckHeader: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.25rem",
});
export const deckColors: any = style({ display: "flex", gap: 4 });
export const colorIndicator: any = style({
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "1px solid #444",
});
export const deckInfo: any = style({
  display: "flex",
  gap: "0.5rem",
  color: "var(--text-secondary)",
  fontSize: "0.9rem",
});
export const deckDate: any = style({
  color: "var(--text-secondary)",
  fontSize: "0.85rem",
});

export const editorPanel: any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const editor: any = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});
export const editorHeader: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
});
export const deckNameInput: any = style({
  flex: 1,
  padding: "0.5rem 0.75rem",
  background: "var(--primary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 6,
  color: "var(--text-primary)",
});
export const deckStats: any = style({
  display: "flex",
  gap: "0.75rem",
  color: "var(--text-secondary)",
});
export const categories: any = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "1rem",
});
export const category: any = style({});
export const cardSlots: any = style({
  background: "var(--primary-bg)",
  border: "1px dashed var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
  minHeight: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-secondary)",
});

export const analysis: any = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
});
export const analysisCard: any = style({
  background: "var(--primary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const statItem: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px dashed var(--border-color)",
  padding: "0.35rem 0",
});

export const noDeck: any = style({
  textAlign: "center",
  color: "var(--text-secondary)",
  padding: "2rem",
});

export const searchPanel: any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const cardResults: any = style({
  padding: "1rem",
  background: "var(--primary-bg)",
  borderRadius: 6,
  border: "1px dashed var(--border-color)",
  color: "var(--text-secondary)",
  textAlign: "center",
});
