import { style } from "@vanilla-extract/css";

export const cardRoot = style({
  position: "relative",
  transition: "all 0.2s ease",
  userSelect: "none",
  touchAction: "none",
});

export const artLayer = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "inherit",
  backgroundSize: "cover",
  backgroundPosition: "center",
  pointerEvents: "none",
});

export const frameOverlay = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "inherit",
  pointerEvents: "none",
});

export const content = style({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  color: "white",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
});

export const manaBadge = style({
  position: "absolute",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  pointerEvents: "none",
});

export const nameBadge = style({
  fontWeight: "bold",
  marginTop: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  pointerEvents: "none",
});

export const typeBadge = style({
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: 2,
  marginTop: "1px",
  pointerEvents: "none",
});

export const ptBadge = style({
  position: "absolute",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  borderRadius: 2,
  fontWeight: "bold",
  pointerEvents: "none",
});

export const counters = style({
  position: "absolute",
  display: "flex",
  gap: "2px",
  pointerEvents: "none",
});

export const counterBubble = style({
  backgroundColor: "#FFD700",
  color: "black",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  pointerEvents: "none",
});
