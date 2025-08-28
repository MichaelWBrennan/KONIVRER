import { style } from "@vanilla-extract/css";

export const shell = style({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  paddingBottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
});

export const title = style({
  fontWeight: 700,
  fontSize: "1.05rem",
  display: "none",
});

export const content = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

export const headerRow = style({ display: "none" });
export const headerActions = style({ display: "none" });
export const iconBtn = style({
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "6px 10px",
  background: "transparent",
  color: "var(--text-primary)",
  cursor: "pointer",
});
