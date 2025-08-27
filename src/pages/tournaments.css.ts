import { style } from "@vanilla-extract/css";

export const container: any : any : any : any = style({
  padding: "2rem",
  maxWidth: 1200,
  margin: "0 auto",
});
export const header: any : any : any : any = style({ textAlign: "center", marginBottom: "1rem" });
export const tabs: any : any : any : any = style({
  display: "flex",
  gap: "0.5rem",
  marginBottom: "1rem",
  flexWrap: "wrap",
});
export const content: any : any : any : any = style({});
export const section: any : any : any : any = style({ display: "grid", gap: "1rem" });
export const empty: any : any : any : any = style({
  textAlign: "center",
  color: "var(--text-secondary)",
  padding: "2rem",
});
export const card: any : any : any : any = style({
  background: "var(--secondary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
export const matchCard: any : any : any : any = style({
  background: "var(--primary-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: 8,
  padding: "1rem",
});
