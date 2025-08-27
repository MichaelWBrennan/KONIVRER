import { style } from "@vanilla-extract/css";

export const header = style({
  backgroundColor: "#2c3e50",
  color: "white",
  padding: "1rem",
  textAlign: "center",
});
export const container = style({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "2rem",
});
export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "1.5rem",
  marginTop: "2rem",
});
export const card = style({
  backgroundColor: "white",
  borderRadius: 8,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  padding: "1.5rem",
  transition: "transform 0.3s ease",
});
export const cardTitle = style({
  marginTop: 0,
  color: "#2c3e50",
  borderBottom: "2px solid #ecf0f1",
  paddingBottom: "0.5rem",
});
export const status = style({
  display: "inline-block",
  padding: "0.25rem 0.75rem",
  borderRadius: 50,
  fontSize: "0.875rem",
  fontWeight: 500,
  marginTop: "0.5rem",
});
export const statusSuccess = style({
  backgroundColor: "#d4edda",
  color: "#155724",
});
export const statusWarning = style({
  backgroundColor: "#fff3cd",
  color: "#856404",
});
export const statusError = style({
  backgroundColor: "#f8d7da",
  color: "#721c24",
});
export const metrics = style({ marginTop: "1rem" });
export const metric = style({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
  fontSize: "0.9rem",
});
export const metricLabel = style({ color: "#6c757d" });
export const chartContainer = style({ height: 200, marginTop: "1rem" });
export const footer = style({
  backgroundColor: "#2c3e50",
  color: "white",
  textAlign: "center",
  padding: "1rem",
  marginTop: "2rem",
});
