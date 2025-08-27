import { style } from "@vanilla-extract/css";

export const viewerWrap: any : any : any : any = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});
export const toolbar: any : any : any : any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
export const title: any : any : any : any = style({ fontWeight: 600, fontSize: "1.1rem" });
export const canvasWrap: any : any : any : any = style({
  display: "flex",
  justifyContent: "center",
  padding: 12,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 8,
});
export const canvas: any : any : any : any = style({
  maxWidth: "100%",
  height: "auto",
  display: "block",
});
