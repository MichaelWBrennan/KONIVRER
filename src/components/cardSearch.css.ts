import { style } from "@vanilla-extract/css";

export const filtersRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});
export const cardsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "1rem",
  padding: "1rem",
});
export const cardItem = style({
  borderRadius: 8,
  cursor: "pointer",
  overflow: "hidden",
  transition: "transform 0.2s, boxShadow 0.2s",
});
export const cardImg = style({ width: "100%", display: "block" });
export const pagination = style({
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
  margin: "2rem 0",
});
export const pageButton = style({
  padding: "0.5rem 1rem",
  border: "1px solid var(--border-color)",
  background: "var(--secondary-bg)",
  cursor: "pointer",
});
export const paginationInfo = style({
  textAlign: "center",
  color: "var(--text-secondary)",
});
export const noResults = style({ textAlign: "center", padding: "2rem" });
