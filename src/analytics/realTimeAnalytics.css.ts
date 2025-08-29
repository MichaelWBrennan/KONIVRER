import { style } from "@vanilla-extract/css";

export const chartArea= style({
  position: "relative",
  height: 160,
  background: "rgba(255,255,255,0.04)",
  borderRadius: 6,
  overflow: "hidden",
});
export const chartBar= style({
  position: "absolute",
  bottom: 0,
  background: "var(--accent-color)",
  opacity: 0.8,
  borderRadius: 2,
});

export const eventItem= style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "0.5rem",
  alignItems: "center",
  marginBottom: "0.5rem",
});
export const eventBar= style({ height: 6, borderRadius: 3 });

export const trendBar= style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
export const trendBarInner= style({
  width: 12,
  background: "var(--accent-color)",
  borderRadius: 2,
});
export const trendLabel= style({
  marginTop: 4,
  fontSize: 12,
  color: "var(--text-secondary)",
});
