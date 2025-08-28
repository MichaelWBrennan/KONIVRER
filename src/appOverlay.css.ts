import { style } from "@vanilla-extract/css";

export const topRight: any : any = style({
  position: "fixed",
  top: "1rem",
  right: "1rem",
  zIndex: 1000,
});
export const restrictNotice: any : any = style({
  padding: "2rem",
  textAlign: "center",
  maxWidth: 600,
  margin: "2rem auto",
  backgroundColor: "var(--secondary-bg)",
  borderRadius: 8,
  border: "2px solid #ff6b6b",
});
export const restrictTitle: any : any = style({
  color: "#ff6b6b",
  marginBottom: "1rem",
});
export const restrictMuted: any : any = style({ color: "#666" });

export const modalMask: any : any = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});
export const modal: any : any = style({
  background: "var(--secondary-bg)",
  padding: "2rem",
  borderRadius: 8,
  maxWidth: 500,
  maxHeight: "80vh",
  overflow: "auto",
  position: "relative",
});
export const modalClose: any : any = style({
  position: "absolute",
  top: 10,
  right: 10,
  background: "transparent",
  border: "none",
  fontSize: 24,
  color: "var(--text-color)",
  cursor: "pointer",
  padding: 4,
  borderRadius: 4,
  lineHeight: "1",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
export const modalImg: any : any = style({
  width: "100%",
  maxWidth: 300,
  marginTop: "1rem",
});
export const modalBody: any : any = style({ marginTop: "1rem" });
export const modalPrimary: any : any = style({
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  background: "var(--accent-color)",
  color: "white",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
});
