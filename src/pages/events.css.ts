import { style, globalStyle } from "@vanilla-extract/css";

export const container = style({
  padding: "2rem",
  maxWidth: 1200,
  margin: "0 auto",
});
export const header = style({
  textAlign: "center",
  marginBottom: "1.5rem",
});
export const nav = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginBottom: "1rem",
});
export const navTabs = style({
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
});
globalStyle(`${navTabs} > button`, {
  background: "#fff",
  color: "#000",
  border: "1px solid #000",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
});
globalStyle(`${navTabs} > button.active`, {
  background: "#000",
  color: "#fff",
});
export const content = style({});
export const list = style({ display: "grid", gap: "1rem" });
export const empty = style({
  textAlign: "center",
  color: "var(--text-secondary)",
  padding: "2rem",
});
export const eventCard = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const eventHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
});
export const eventName = style({
  margin: 0,
  color: "var(--text-primary)",
});
export const eventStatus = style({
  color: "var(--text-secondary)",
  fontSize: "0.85rem",
});
export const eventDetails = style({ color: "var(--text-secondary)" });
export const actions = style({
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.75rem",
});
export const viewSelector = style({
  display: "flex",
  gap: "0.5rem",
});
globalStyle(`${viewSelector} > button`, {
  background: "#fff",
  color: "#000",
  border: "1px solid #000",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
});
globalStyle(`${viewSelector} > button.active`, {
  background: "#000",
  color: "#fff",
});

// New styles for the reworked UI
export const timeFrameDropdown = style({
  marginBottom: "1rem",
  display: "flex",
  justifyContent: "center",
});

export const timeFrameSelect = style({
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  fontSize: "0.9rem",
  cursor: "pointer",
  minWidth: "150px",
});

export const advancedSearchToggle = style({
  marginBottom: "1rem",
  display: "flex",
  justifyContent: "center",
});

export const advancedSearchButton = style({
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
});

globalStyle(`${advancedSearchButton}:hover`, {
  background: "var(--border-color)",
});

export const advancedSearchPanel = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
  marginBottom: "1rem",
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

globalStyle(`${timeFrameInput} label`, {
  fontSize: "0.85rem",
  color: "var(--text-secondary)",
});

globalStyle(`${timeFrameInput} input`, {
  background: "var(--primary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 4,
  padding: "0.5rem",
  fontSize: "0.9rem",
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
});

globalStyle(`${applySearchButton}:hover`, {
  background: "var(--accent-hover, #0056b3)",
});

export const selectedEventView = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});

export const selectedEventHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1rem",
});

export const backButton = style({
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
});

globalStyle(`${backButton}:hover`, {
  background: "var(--border-color)",
});

export const eventPairings = style({
  color: "var(--text-secondary)",
  fontStyle: "italic",
});

// Make event cards clickable
globalStyle(`${eventCard}`, {
  cursor: "pointer",
  transition: "all 0.2s ease",
});

globalStyle(`${eventCard}:hover`, {
  background: "var(--hover-bg, rgba(255,255,255,0.05))",
  borderColor: "var(--accent-color, #007bff)",
});

// Geolocation and Store Search Styles
export const geolocationSection = style({
  marginBottom: "1rem",
  padding: "1rem",
  background: "var(--primary-bg)",
  border: "1px solid var(--border-color)",
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
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 4,
  padding: "0.25rem 0.5rem",
  cursor: "pointer",
  fontSize: "0.8rem",
  transition: "all 0.2s ease",
});

globalStyle(`${refreshLocationButton}:hover`, {
  background: "var(--border-color)",
});

export const storeSection = style({
  marginBottom: "1rem",
  padding: "1rem",
  background: "var(--primary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
});

export const storeInput = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  minWidth: "200px",
});

globalStyle(`${storeInput} select`, {
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 4,
  padding: "0.5rem",
  fontSize: "0.9rem",
  cursor: "pointer",
});

globalStyle(`${geolocationSection} h4, ${storeSection} h4`, {
  margin: "0 0 0.75rem 0",
  color: "var(--text-primary)",
  fontSize: "1rem",
  fontWeight: "600",
});

globalStyle(`${geolocationInput} label, ${storeInput} label`, {
  fontSize: "0.85rem",
  color: "var(--text-secondary)",
  fontWeight: "500",
});

globalStyle(`${geolocationInput} input`, {
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 4,
  padding: "0.5rem",
  fontSize: "0.9rem",
});

// Advanced Filters Styles
export const advancedFiltersSection = style({
  marginBottom: "1rem",
  padding: "1rem",
  background: "var(--primary-bg)",
  border: "1px solid var(--border-color)",
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

globalStyle(`${filterGroup} label`, {
  fontSize: "0.85rem",
  color: "var(--text-secondary)",
  fontWeight: "500",
});

globalStyle(`${filterGroup} select`, {
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 4,
  padding: "0.5rem",
  fontSize: "0.9rem",
  cursor: "pointer",
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

globalStyle(`${priceRangeInputs} input`, {
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 4,
  padding: "0.5rem",
  fontSize: "0.9rem",
  width: "100px",
});

globalStyle(`${priceRangeInputs} span`, {
  color: "var(--text-secondary)",
  fontSize: "0.9rem",
});

globalStyle(`${advancedFiltersSection} h4`, {
  margin: "0 0 0.75rem 0",
  color: "var(--text-primary)",
  fontSize: "1rem",
  fontWeight: "600",
});

// Main Search Styles
export const mainSearchSection = style({
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "center",
});

export const mainSearchBar = style({
  display: "flex",
  gap: "0.5rem",
  maxWidth: "600px",
  width: "100%",
});

export const mainSearchInput = style({
  flex: 1,
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  outline: "none",
  transition: "all 0.2s ease",
});

globalStyle(`${mainSearchInput}:focus`, {
  borderColor: "var(--accent-color, #007bff)",
  boxShadow: "0 0 0 2px rgba(0, 123, 255, 0.25)",
});

export const mainSearchButton = style({
  background: "var(--accent-color, #007bff)",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontWeight: "500",
});

globalStyle(`${mainSearchButton}:hover`, {
  background: "var(--accent-hover, #0056b3)",
  transform: "translateY(-1px)",
});

export const advancedSearchToggleButton = style({
  background: "var(--secondary-bg)",
  color: "var(--text-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "0.5rem 1rem",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

globalStyle(`${advancedSearchToggleButton}:hover`, {
  background: "var(--border-color)",
});

export const dropdownArrow = style({
  fontSize: "0.8rem",
  transition: "transform 0.2s ease",
});
