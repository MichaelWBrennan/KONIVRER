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
