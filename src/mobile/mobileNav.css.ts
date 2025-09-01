import { style, keyframes } from "@vanilla-extract/css";

export const nav = style({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  background: "rgba(20,20,26,0.9)",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  paddingBottom: "env(safe-area-inset-bottom, 0px)",
  boxShadow: "0 -8px 24px rgba(0,0,0,0.45)",
});

export const navInner = style({
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  alignItems: "center",
  height: 56,
});

export const tab = style({
  padding: "8px 0 10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-secondary)",
  cursor: "pointer",
  position: "relative",
  transition: "color 0.15s ease",
  selectors: {
    "&:active": { opacity: 0.9 },
    "&:hover": { color: "var(--text-primary)" },
    "&::after": {
      content: "",
      position: "absolute",
      bottom: 4,
      height: 2,
      width: 0,
      borderRadius: 2,
      left: "50%",
      transform: "translateX(-50%)",
      transition: "width 0.2s ease, background-color 0.2s ease",
      background: "transparent",
    },
    "&:hover::after": { width: 18, background: "rgba(255,255,255,0.25)" },
    "&:focus-visible": {
      outline: "2px solid var(--accent-color)",
      outlineOffset: 4,
      borderRadius: 10,
    },
  },
});

export const tabActive = style({
  color: "var(--text-primary)",
  selectors: {
    "&::after": { width: 24, background: "var(--accent-color)" },
  },
});

export const label = style({ fontSize: 12, fontWeight: 600, letterSpacing: 0.2, marginTop: 2 });

export const moreOverlay = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  zIndex: 1001,
  display: "flex",
  alignItems: "flex-end",
  animation: `${keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })} 120ms ease-out`,
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
  boxShadow: "0 -10px 30px rgba(0,0,0,0.55)",
  animation: `${keyframes({
    from: { transform: "translateY(10px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  })} 140ms ease-out`,
});

export const sheetItem = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 8px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  color: "var(--text-primary)",
  cursor: "pointer",
  borderRadius: 10,
  transition: "background 0.15s ease, transform 0.12s ease",
  selectors: {
    "&:hover": { background: "rgba(255,255,255,0.05)" },
    "&:active": { transform: "translateY(0) scale(0.99)" },
    "&:focus-visible": {
      outline: "2px solid var(--accent-color)",
      outlineOffset: 2,
    },
  },
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
  transition: "background 0.15s ease, border-color 0.15s ease",
  selectors: { "&:hover": { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.2)" } },
});
