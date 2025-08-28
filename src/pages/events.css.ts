import { style } from "@vanilla-extract/css";

export const container: any = style({
  padding: "2rem",
  maxWidth: 1200,
  margin: "0 auto",
});
export const header: any = style({
  textAlign: "center",
  marginBottom: "1.5rem",
});
export const nav: any = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginBottom: "1rem",
});
export const navTabs: any = style({
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
});
export const content: any = style({});
export const list: any = style({ display: "grid", gap: "1rem" });
export const empty: any = style({
  textAlign: "center",
  color: "var(--text-secondary)",
  padding: "2rem",
});
export const eventCard: any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const eventHeader: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
});
export const eventName: any = style({
  margin: 0,
  color: "var(--text-primary)",
});
export const eventStatus: any = style({
  color: "var(--text-secondary)",
  fontSize: "0.85rem",
});
export const eventDetails: any = style({ color: "var(--text-secondary)" });
export const actions: any = style({
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.75rem",
});
export const viewSelector: any = style({ display: "flex", gap: "0.5rem" });
