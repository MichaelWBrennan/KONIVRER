import { style } from "@vanilla-extract/css";

export const chartArea: any : any = style({
  position: "relative",
  height: 160,
  background: "rgba(255,255,255,0.04)",
  borderRadius: 6,
  overflow: "hidden",
});
export const chartBar: any : any = style({
  position: "absolute",
  bottom: 0,
  background: "var(--accent-color)",
  opacity: 0.8,
  borderRadius: 2,
});

export const eventItem: any : any = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "0.5rem",
  alignItems: "center",
  marginBottom: "0.5rem",
});
export const eventBar: any : any = style({ height: 6, borderRadius: 3 });

export const trendBar: any : any = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
export const trendBarInner: any : any = style({
  width: 12,
  background: "var(--accent-color)",
  borderRadius: 2,
});
export const trendLabel: any : any = style({
  marginTop: 4,
  fontSize: 12,
  color: "var(--text-secondary)",
});
