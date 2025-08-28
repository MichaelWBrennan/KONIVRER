import { style } from "@vanilla-extract/css";

export const overlay: any = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 20,
});
export const modal: any = style({
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 12,
  maxWidth: 900,
  maxHeight: "90vh",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});
export const close: any = style({
  position: "absolute",
  top: 16,
  right: 16,
  background: "#333",
  border: "1px solid #555",
  color: "#fff",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: "bold",
  zIndex: 10,
});
export const content: any = style({
  display: "flex",
  gap: 24,
  padding: 24,
  overflowY: "auto",
  flex: 1,
});
export const imageSection: any = style({
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
});
export const cardImage: any = style({
  width: 250,
  height: "auto",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
});
export const infoSection: any = style({
  flex: 1,
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  minWidth: 0,
});
export const basicInfo: any = style({
  background: "#2c2c2c",
  border: "1px solid #444",
  borderRadius: 8,
  padding: 16,
});
export const infoRow: any = style({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
});
export const label: any = style({ fontWeight: 600, color: "#aaa" });
export const value: any = style({ color: "#fff", fontWeight: 500 });
export const description: any = style({
  background: "#2c2c2c",
  border: "1px solid #444",
  borderRadius: 8,
  padding: 16,
});
