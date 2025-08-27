import { style } from "@vanilla-extract/css";

export const wrap: any : any : any = style({
  position: "sticky",
  top: 0,
  zIndex: 998,
  background: "rgba(18,18,24,0.95)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "8px 12px",
});

export const input: any : any : any = style({
  width: "100%",
  height: 40,
  padding: "0 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "var(--text-primary)",
  fontSize: 15,
});
