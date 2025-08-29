import { style } from "@vanilla-extract/css";

export const cardRoot: any : any : any : any = style({
  position: "relative",
  transition: "all 0.2s ease",
  userSelect: "none",
  touchAction: "none",
});

export const artLayer: any : any : any : any = style({
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

export const frameOverlay: any : any : any : any = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "inherit",
  pointerEvents: "none",
});

export const content: any : any : any : any = style({
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  color: "white",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
});

export const manaBadge: any : any : any : any = style({
  position: "absolute",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  pointerEvents: "none",
});

export const nameBadge: any : any : any : any = style({
  fontWeight: "bold",
  marginTop: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: 2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  pointerEvents: "none",
});

export const typeBadge: any : any : any : any = style({
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: 2,
  marginTop: "1px",
  pointerEvents: "none",
});

export const ptBadge: any : any : any : any = style({
  position: "absolute",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  borderRadius: 2,
  fontWeight: "bold",
  pointerEvents: "none",
});

export const counters: any : any : any : any = style({
  position: "absolute",
  display: "flex",
  gap: "2px",
  pointerEvents: "none",
});

export const counterBubble: any : any : any : any = style({
  backgroundColor: "#FFD700",
  color: "black",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  pointerEvents: "none",
});
