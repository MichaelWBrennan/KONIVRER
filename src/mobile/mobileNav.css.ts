import { style } from "@vanilla-extract/css";

export const nav = style({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  background: "transparent",
  borderTop: "none",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
});

export const navInner = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  alignItems: "stretch",
  gap: 0,
  margin: "0",
  border: "none",
  borderRadius: 0,
  overflow: "visible",
  background: "transparent",
});

export const tab = style({
  padding: "10px 0 8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#000",
  background: "#fff",
  cursor: "pointer",
  borderRight: "1px solid var(--border-color)",
  selectors: {
    "&:active": { opacity: 0.8 },
    "&:hover": {
      background: "rgba(0,0,0,0.08)",
    },
  },
});

export const tabActive = style({
  color: "#fff",
  background: "#000",
});

export const label = style({
  fontSize: 11,
  marginTop: 4,
  fontFamily:
    "OpenDyslexic, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  fontWeight: 500 as any,
});

export const moreOverlay = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  zIndex: 1001,
  display: "flex",
  alignItems: "flex-end",
});

export const sheet = style({
  width: "100%",
  background: "rgba(24,24,30,0.98)",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  borderTop: "1px solid rgba(255,255,255,0.08)",
  maxHeight: "60vh",
  overflowY: "auto",
  padding: 12,
});

export const sheetItem = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 8px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  color: "var(--text-primary)",
  cursor: "pointer",
});

export const sheetHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "4px 6px 10px 6px",
});
export const closeBtn = style({
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "6px 10px",
  background: "transparent",
  color: "var(--text-primary)",
  cursor: "pointer",
});
