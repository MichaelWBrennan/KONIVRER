import { style } from "@vanilla-extract/css";

export const wikiContainer = style({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "#f8f9fa",
  fontFamily: "system-ui, -apple-system, sans-serif",
});

export const wikiHeader = style({
  backgroundColor: "#2c3e50",
  color: "white",
  padding: "2rem",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

export const wikiContent = style({
  display: "flex",
  flex: 1,
  overflow: "hidden",
});

export const sidebar = style({
  width: "300px",
  backgroundColor: "#34495e",
  color: "white",
  padding: "1.5rem",
  overflowY: "auto",
  borderRight: "1px solid #2c3e50",
});

export const searchSection = style({
  marginBottom: "2rem",
});

export const searchInput = style({
  width: "100%",
  padding: "0.75rem",
  border: "none",
  borderRadius: "4px",
  fontSize: "1rem",
  backgroundColor: "white",
  color: "#2c3e50",
  "::placeholder": {
    color: "#7f8c8d",
  },
  ":focus": {
    outline: "2px solid #3498db",
    outlineOffset: "2px",
  },
});

export const categoryFilter = style({
  marginBottom: "2rem",
});

export const categoryButtons = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const categoryButton = style({
  padding: "0.75rem 1rem",
  border: "1px solid #7f8c8d",
  borderRadius: "4px",
  backgroundColor: "transparent",
  color: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
  fontSize: "0.9rem",
  ":hover": {
    backgroundColor: "#7f8c8d",
  },
});

export const active = style({
  backgroundColor: "#3498db",
  borderColor: "#3498db",
  ":hover": {
    backgroundColor: "#2980b9",
  },
});

export const sectionList = style({
  marginBottom: "2rem",
});

export const sectionListItems = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const sectionButton = style({
  width: "100%",
  padding: "0.75rem 1rem",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "transparent",
  color: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textAlign: "left",
  fontSize: "0.9rem",
  marginBottom: "0.25rem",
  ":hover": {
    backgroundColor: "#7f8c8d",
  },
});

export const mainContent = style({
  flex: 1,
  padding: "2rem",
  overflowY: "auto",
  backgroundColor: "white",
});

export const sectionContent = style({
  maxWidth: "800px",
  margin: "0 auto",
});

export const sectionTitle = style({
  color: "#2c3e50",
  fontSize: "2.5rem",
  marginBottom: "1.5rem",
  borderBottom: "3px solid #3498db",
  paddingBottom: "0.5rem",
});

export const sectionBody = style({
  fontSize: "1.1rem",
  lineHeight: "1.6",
  color: "#2c3e50",
  marginBottom: "2rem",
  "h1, h2, h3, h4, h5, h6": {
    color: "#2c3e50",
    marginTop: "2rem",
    marginBottom: "1rem",
  },
  "h1": {
    fontSize: "2rem",
    borderBottom: "2px solid #3498db",
    paddingBottom: "0.25rem",
  },
  "h2": {
    fontSize: "1.75rem",
    color: "#34495e",
  },
  "h3": {
    fontSize: "1.5rem",
    color: "#34495e",
  },
  "h4": {
    fontSize: "1.25rem",
    color: "#34495e",
  },
  "ul, ol": {
    marginLeft: "1.5rem",
    marginBottom: "1rem",
  },
  "li": {
    marginBottom: "0.5rem",
  },
  "table": {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "1.5rem",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  "th, td": {
    padding: "0.75rem",
    textAlign: "left",
    borderBottom: "1px solid #ecf0f1",
  },
  "th": {
    backgroundColor: "#f8f9fa",
    fontWeight: "600",
    color: "#2c3e50",
  },
  "tr:hover": {
    backgroundColor: "#f8f9fa",
  },
  "code": {
    backgroundColor: "#f1f2f6",
    padding: "0.2rem 0.4rem",
    borderRadius: "3px",
    fontFamily: "monospace",
    fontSize: "0.9em",
  },
  "blockquote": {
    borderLeft: "4px solid #3498db",
    paddingLeft: "1rem",
    marginLeft: 0,
    fontStyle: "italic",
    color: "#7f8c8d",
  },
  "strong": {
    fontWeight: "600",
    color: "#2c3e50",
  },
  "em": {
    fontStyle: "italic",
    color: "#7f8c8d",
  },
});

export const subsections = style({
  marginTop: "2rem",
  paddingTop: "2rem",
  borderTop: "1px solid #ecf0f1",
});

export const subsection = style({
  marginBottom: "2rem",
  padding: "1.5rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #ecf0f1",
});

export const subsectionContent = style({
  fontSize: "1rem",
  lineHeight: "1.6",
  color: "#2c3e50",
  "h1, h2, h3, h4, h5, h6": {
    color: "#2c3e50",
    marginTop: "1.5rem",
    marginBottom: "0.75rem",
  },
  "h3": {
    fontSize: "1.25rem",
    color: "#34495e",
  },
});

export const noContent = style({
  textAlign: "center",
  padding: "4rem 2rem",
  color: "#7f8c8d",
  "h2": {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  "p": {
    fontSize: "1.1rem",
  },
});

// Responsive design
export const mobileSidebar = style({
  "@media": {
    "screen and (max-width: 768px)": {
      position: "fixed",
      top: 0,
      left: "-300px",
      height: "100vh",
      zIndex: 1000,
      transition: "left 0.3s ease",
    },
  },
});

export const mobileMainContent = style({
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "1rem",
    },
  },
});

export const mobileHeader = style({
  "@media": {
    "screen and (max-width: 768px)": {
      padding: "1rem",
      "h1": {
        fontSize: "1.5rem",
      },
      "p": {
        fontSize: "0.9rem",
      },
    },
  },
});