import { style } from "@vanilla-extract/css";

export const container: any = style({
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: "1.6",
});

export const header: any = style({
  textAlign: "center",
  marginBottom: "40px",
  padding: "20px 0",
  borderBottom: "2px solid #e0e0e0",
});

export const title: any = style({
  fontSize: "2.5rem",
  margin: "0 0 10px 0",
  color: "#2c3e50",
});

export const subtitle: any = style({
  fontSize: "1.2rem",
  color: "#7f8c8d",
  margin: 0,
});

export const content: any = style({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
});

export const section: any = style({
  padding: "20px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
});

export const sectionTitle: any = style({
  fontSize: "1.8rem",
  margin: "0 0 15px 0",
  color: "#34495e",
  borderBottom: "2px solid #3498db",
  paddingBottom: "10px",
});

export const text: any = style({
  fontSize: "1rem",
  margin: "0 0 15px 0",
  color: "#2c3e50",
});

export const realmCard: any = style({
  backgroundColor: "white",
  padding: "15px",
  margin: "15px 0",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

export const realmTitle: any = style({
  fontSize: "1.4rem",
  margin: "0 0 10px 0",
  color: "#2980b9",
});

export const realmDescription: any = style({
  fontSize: "1rem",
  margin: 0,
  color: "#2c3e50",
});
