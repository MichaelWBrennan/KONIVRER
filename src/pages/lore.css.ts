import { style } from "@vanilla-extract/css";

export const container: any : any : any = style({
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: "1.6",
});

export const header: any : any : any = style({
  textAlign: "center",
  marginBottom: "40px",
  padding: "20px 0",
  borderBottom: "2px solid #e0e0e0",
});

export const title: any : any : any = style({
  fontSize: "2.5rem",
  margin: "0 0 10px 0",
  color: "#2c3e50",
});

export const subtitle: any : any : any = style({
  fontSize: "1.2rem",
  color: "#7f8c8d",
  margin: 0,
});

export const content: any : any : any = style({
  display: "flex",
  flexDirection: "column",
  gap: "30px",
});

export const section: any : any : any = style({
  padding: "20px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
});

export const sectionTitle: any : any : any = style({
  fontSize: "1.8rem",
  margin: "0 0 15px 0",
  color: "#34495e",
  borderBottom: "2px solid #3498db",
  paddingBottom: "10px",
});

export const text: any : any : any = style({
  fontSize: "1rem",
  margin: "0 0 15px 0",
  color: "#2c3e50",
});

export const realmCard: any : any : any = style({
  backgroundColor: "white",
  padding: "15px",
  margin: "15px 0",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

export const realmTitle: any : any : any = style({
  fontSize: "1.4rem",
  margin: "0 0 10px 0",
  color: "#2980b9",
});

export const realmDescription: any : any : any = style({
  fontSize: "1rem",
  margin: 0,
  color: "#2c3e50",
});

// Diagram section styles
export const diagramContainer: any : any : any = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
});

export const diagramImage: any : any : any = style({
  width: "100%",
  maxWidth: "720px",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
});

export const caption: any : any : any = style({
  fontSize: "0.95rem",
  color: "#6c757d",
  textAlign: "center",
});

// Virtues grid
export const virtuesGrid: any : any : any = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
});

export const virtueCard: any : any : any = style({
  backgroundColor: "white",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
});

export const virtueTitle: any : any : any = style({
  margin: "0 0 6px 0",
  fontSize: "1.05rem",
  color: "#2c3e50",
});

export const virtueText: any : any : any = style({
  margin: 0,
  fontSize: "0.95rem",
  color: "#2c3e50",
});
