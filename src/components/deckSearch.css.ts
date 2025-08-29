import { style } from "@vanilla-extract/css";

export const cardItem= style({ cursor: "default" });
export const previewRow= style({
  display: "flex",
  height: 200,
  overflow: "hidden",
});
export const previewImg= style({ display: "block" });
export const desc= style({ marginTop: "0.5rem", fontSize: "0.8rem" });
export const meta= style({
  marginTop: "0.5rem",
  fontSize: "0.7rem",
  color: "var(--text-secondary)",
});
export const actions= style({
  marginTop: "1rem",
  display: "flex",
  gap: "0.5rem",
});
export const actionBtn= style({ flex: 1 });
