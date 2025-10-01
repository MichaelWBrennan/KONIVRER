import { style } from "@vanilla-extract/css";

export const wrap = style({
  position: "sticky",
  top: 0,
  zIndex: 998,
  background: "rgba(18,18,24,0.95)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "8px 12px",
});

export const mainSearchBar = style({
  display: "flex",
  gap: "0.5rem",
  marginBottom: "0.5rem",
});

export const input = style({
  flex: 1,
  height: 40,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "var(--text-primary)",
  fontSize: 15,
});

export const searchButton = style({
  background: "var(--accent-color, #007bff)",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "0 16px",
  fontSize: 15,
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontWeight: "500",
  minWidth: "80px",
});

export const advancedSearchToggle = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.5rem",
});

export const advancedSearchToggleButton = style({
  background: "var(--secondary-bg, rgba(255,255,255,0.1))",
  color: "var(--text-primary)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const dropdownArrow = style({
  fontSize: "0.8rem",
  transition: "transform 0.2s ease",
});

export const advancedSearchPanel = style({
  background: "var(--secondary-bg, rgba(0,0,0,0.3))",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "1rem",
  marginTop: "0.5rem",
  // Ensure it can scroll when constrained by inline maxHeight
  overflowY: "auto",
});

export const timeFrameInputs = style({
  display: "flex",
  gap: "1rem",
  marginBottom: "1rem",
  flexWrap: "wrap",
});

export const timeFrameInput = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  minWidth: "150px",
});

export const geolocationSection = style({
  marginBottom: "1rem",
  padding: "1rem",
  background: "var(--primary-bg, rgba(0,0,0,0.2))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
});

export const geolocationInputs = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
});

export const geolocationInput = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  minWidth: "200px",
});

export const geolocationStatus = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flexWrap: "wrap",
});

export const locationFound = style({
  color: "var(--success-color, #28a745)",
  fontSize: "0.85rem",
  fontWeight: "500",
});

export const locationNotFound = style({
  color: "var(--warning-color, #ffc107)",
  fontSize: "0.85rem",
  fontWeight: "500",
});

export const refreshLocationButton = style({
  background: "var(--secondary-bg, rgba(255,255,255,0.1))",
  color: "var(--text-primary)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 4,
  padding: "0.25rem 0.5rem",
  cursor: "pointer",
  fontSize: "0.8rem",
  transition: "all 0.2s ease",
});

export const storeSection = style({
  marginBottom: "1rem",
  padding: "1rem",
  background: "var(--primary-bg, rgba(0,0,0,0.2))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
});

export const storeInput = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  minWidth: "200px",
});

export const advancedFiltersSection = style({
  marginBottom: "1rem",
  padding: "1rem",
  background: "var(--primary-bg, rgba(0,0,0,0.2))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
});

export const filtersGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginBottom: "1rem",
});

export const filterGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const priceRangeSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const priceRangeInputs = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const buildDeckButton = style({
  background: "var(--accent-color, #007bff)",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: 14,
  transition: "all 0.2s ease",
  fontWeight: "500",
});

export const applySearchButton = style({
  background: "var(--accent-color, #007bff)",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
  width: "100%",
});

export const loreCategorySelect = style({
  background: "var(--secondary-bg, rgba(255,255,255,0.1))",
  color: "var(--text-primary)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "0.5rem 0.75rem",
  fontSize: 14,
  minHeight: 36,
  cursor: "pointer",
});
