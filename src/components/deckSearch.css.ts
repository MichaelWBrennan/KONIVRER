import { style } from "@vanilla-extract/css";

export const cardItem: any = style({ cursor: "default" });
export const previewRow: any = style({
  display: "flex",
  height: 200,
  overflow: "hidden",
});
export const previewImg: any = style({ display: "block" });
export const desc: any = style({ marginTop: "0.5rem", fontSize: "0.8rem" });
export const meta: any = style({
  marginTop: "0.5rem",
  fontSize: "0.7rem",
  color: "var(--text-secondary)",
});
export const actions: any = style({
  marginTop: "1rem",
  display: "flex",
  gap: "0.5rem",
});
export const actionBtn: any = style({ flex: 1 });
