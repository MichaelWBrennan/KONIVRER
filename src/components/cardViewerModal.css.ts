import { style } from "@vanilla-extract/css";

export const overlay: any = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
});
export const content: any = style({
  position: "relative",
  maxWidth: "80vw",
  maxHeight: "80vh",
});
export const closeBtn: any = style({
  position: "absolute",
  top: "-1rem",
  right: "-1rem",
  background: "white",
  color: "black",
  border: "2px solid black",
  borderRadius: "50%",
  width: 32,
  height: 32,
  cursor: "pointer",
  fontSize: "1.5rem",
  lineHeight: "1",
});
export const loading: any = style({ color: "white", fontSize: "2rem" });
export const error: any = style({ color: "red", fontSize: "1.5rem" });
export const image: any = style({
  width: "100%",
  height: "100%",
  objectFit: "contain",
});
