import { style } from "@vanilla-extract/css";

export const container= style({});
export const homeRoot= style({});
export const header= style({ textAlign: "center" });
export const title= style({ fontWeight: 700 });
export const subtitle= style({});
export const divider= style({});
export const content= style({});
export const latestSection= style({});
export const latestTitle= style({ fontWeight: 600 });
export const latestDescription= style({});
export const featuredButtons= style({ display: "flex", gap: "0.75rem" });
export const newsGrid= style({ display: "grid", gap: "1rem" });
export const newsCard= style({});
export const newsDate= style({ fontSize: "0.75rem" });
export const linkBar= style({ padding: "1rem", textAlign: "right" });
export const link= style({ color: "#0ea5e9" });
export const hero= style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 120,
});
