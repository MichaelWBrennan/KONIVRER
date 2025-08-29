import { style } from "@vanilla-extract/css";

export const container: any = style({});
export const homeRoot: any = style({});
export const header: any = style({ textAlign: "center" });
export const title: any = style({ fontWeight: 700 });
export const subtitle: any = style({});
export const divider: any = style({});
export const content: any = style({});
export const latestSection: any = style({});
export const latestTitle: any = style({ fontWeight: 600 });
export const latestDescription: any = style({});
export const featuredButtons: any = style({ display: "flex", gap: "0.75rem" });
export const newsGrid: any = style({ display: "grid", gap: "1rem" });
export const newsCard: any = style({});
export const newsDate: any = style({ fontSize: "0.75rem" });
export const linkBar: any = style({ padding: "1rem", textAlign: "right" });
export const link: any = style({ color: "#0ea5e9" });
export const hero: any = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 120,
});
