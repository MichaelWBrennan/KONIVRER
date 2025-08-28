import { style } from "@vanilla-extract/css";

export const root: any : any = style({
  padding: "2rem",
  maxWidth: 1200,
  margin: "0 auto",
});
export const header: any : any = style({ textAlign: "center", marginBottom: "2rem" });
export const controls: any : any = style({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  marginBottom: "2rem",
  flexWrap: "wrap",
});
export const searchSection: any : any = style({ flex: 1, minWidth: 250 });
export const searchInput: any : any = style({
  width: "100%",
  padding: "0.75rem",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  fontSize: "1rem",
});
export const filterSection: any : any = style({ display: "flex", gap: "0.5rem" });
export const select: any : any = style({
  padding: "0.75rem",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
});
export const decksGrid: any : any = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
});
export const deckCard: any : any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  padding: "1.5rem",
  transition: "all 0.2s ease",
});
export const deckHeader: any : any = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1rem",
});
export const deckName: any : any = style({
  color: "var(--text-primary)",
  margin: 0,
  fontSize: "1.2rem",
  fontWeight: "bold",
});
export const visibilityBadge: any : any = style({
  fontSize: "0.8rem",
  padding: "0.25rem 0.5rem",
  borderRadius: 4,
  fontWeight: "bold",
});
export const visibilityPublic: any : any = style({
  background: "rgba(34, 197, 94, 0.2)",
  color: "#22c55e",
});
export const visibilityPrivate: any : any = style({
  background: "rgba(156, 163, 175, 0.2)",
  color: "#9ca3af",
});
export const deckInfo: any : any = style({ marginBottom: "1.5rem" });
export const deckDescription: any : any = style({
  color: "var(--text-secondary)",
  marginBottom: "1rem",
  fontSize: "0.95rem",
  lineHeight: 1.4,
});
export const deckStats: any : any = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  marginBottom: "0.75rem",
});
export const stat: any : any = style({
  fontSize: "0.85rem",
  color: "var(--text-secondary)",
});
export const deckDates: any : any = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});
export const date: any : any = style({
  fontSize: "0.8rem",
  color: "var(--text-muted)",
});
export const deckActions: any : any = style({
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
});
export const actionBtn: any : any = style({
  flex: 1,
  minWidth: 70,
  padding: "0.5rem 0.75rem",
  fontSize: "0.85rem",
  borderRadius: 6,
  transition: "all 0.2s ease",
});
export const emptyState: any : any = style({
  textAlign: "center",
  padding: "3rem",
  color: "var(--text-secondary)",
});
