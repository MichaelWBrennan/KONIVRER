import { style } from "@vanilla-extract/css";

export const root: any = style({ padding: 12 });
export const tabs: any = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 8,
  marginBottom: 12,
});
export const tab: any = style({
  padding: "8px 6px",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  cursor: "pointer",
});
export const tabActive: any = style({ background: "rgba(255,255,255,0.06)" });

export const search: any = style({ marginBottom: 10 });
export const pairingItem: any = style({
  display: "flex",
  justifyContent: "space-between",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  padding: 10,
  marginBottom: 8,
});
export const timer: any = style({
  fontVariantNumeric: "tabular-nums",
  textAlign: "center",
  margin: "12px 0",
  fontSize: "1.2rem",
});
export const form: any = style({ display: "grid", gap: 8 });
