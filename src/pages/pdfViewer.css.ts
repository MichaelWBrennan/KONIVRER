import { style } from "@vanilla-extract/css";

export const viewerWrap = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});
export const toolbar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
export const title = style({ fontWeight: 600, fontSize: "1.1rem" });
export const canvasWrap = style({
  display: "flex",
  justifyContent: "center",
  padding: 12,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 8,
});
export const canvas = style({
  maxWidth: "100%",
  height: "auto",
  display: "block",
});

// Iframe-based PDF viewer frame styling
export const frame = style({
  width: "100%",
  height: "80vh",
  border: "none",
  display: "block",
});

// Adobe PDF Embed container styling
export const embedContainer = style({
  width: "100%",
  height: "80vh",
  border: "none",
  display: "block",
  background: "#1a1a1a",
});
