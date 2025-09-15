import { style } from "@vanilla-extract/css";

export const container = style({
  padding: "12px",
  maxWidth: "100%",
  margin: "0 auto",
  lineHeight: "1.6",
  "@media": {
    "screen and (min-width: 640px)": {
      padding: "16px",
    },
    "screen and (min-width: 768px)": {
      padding: "20px",
      maxWidth: "800px",
    },
  },
});

export const header = style({
  textAlign: "center",
  marginBottom: "24px",
  padding: "12px 0",
  borderBottom: "2px solid #e0e0e0",
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: "40px",
      padding: "20px 0",
    },
  },
});

export const title = style({
  fontSize: "1.75rem",
  margin: "0 0 10px 0",
  color: "#2c3e50",
  "@media": {
    "screen and (min-width: 640px)": {
      fontSize: "2rem",
    },
    "screen and (min-width: 1024px)": {
      fontSize: "2.5rem",
    },
  },
});

export const subtitle = style({
  fontSize: "1rem",
  color: "#7f8c8d",
  margin: 0,
  "@media": {
    "screen and (min-width: 640px)": { fontSize: "1.1rem" },
    "screen and (min-width: 1024px)": { fontSize: "1.2rem" },
  },
});

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  "@media": {
    "screen and (min-width: 768px)": { gap: "30px" },
  },
});

export const tabsBar = style({
  display: "flex",
  gap: "8px",
  overflowX: "auto",
  padding: "8px 0",
  borderBottom: "1px solid #e0e0e0",
  position: "sticky",
  top: "env(safe-area-inset-top, 0px)",
  backgroundColor: "#fff",
  zIndex: 10,
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
});

export const tabButton = style({
  padding: "10px 12px",
  minHeight: "44px",
  fontSize: "0.95rem",
  backgroundColor: "#f2f4f6",
  border: "1px solid #d9dde1",
  borderRadius: "6px",
  whiteSpace: "nowrap",
  cursor: "pointer",
  flex: "0 0 auto",
  scrollSnapAlign: "start",
  selectors: {
    "&:hover": { backgroundColor: "#e8ecef" },
  },
});

export const tabActive = style({
  backgroundColor: "#e8f4ff",
  borderColor: "#a8d0ff",
  color: "#1b5fa8",
});

export const pre = style({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: "1rem",
  color: "#2c3e50",
  margin: 0,
  "@media": {
    "screen and (min-width: 1024px)": { fontSize: "1.05rem" },
  },
});

export const highlight = style({
  backgroundColor: "#fff59d",
  borderRadius: "2px",
});

export const section = style({
  padding: "16px",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  border: "1px solid #e9ecef",
  "@media": {
    "screen and (min-width: 768px)": { padding: "20px" },
  },
});

export const sectionTitle = style({
  fontSize: "1.25rem",
  margin: "0 0 15px 0",
  color: "#34495e",
  borderBottom: "2px solid #3498db",
  paddingBottom: "10px",
  "@media": {
    "screen and (min-width: 640px)": { fontSize: "1.5rem" },
    "screen and (min-width: 768px)": { fontSize: "1.8rem" },
  },
});

export const text = style({
  fontSize: "1rem",
  margin: "0 0 15px 0",
  color: "#2c3e50",
});

export const realmCard = style({
  backgroundColor: "white",
  padding: "15px",
  margin: "15px 0",
  borderRadius: "6px",
  border: "1px solid #dee2e6",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

export const realmTitle = style({
  fontSize: "1.4rem",
  margin: "0 0 10px 0",
  color: "#2980b9",
});

export const realmDescription = style({
  fontSize: "1rem",
  margin: 0,
  color: "#2c3e50",
});

// Diagram section styles
export const diagramContainer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
});

export const diagramImage = style({
  width: "100%",
  maxWidth: "720px",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
});

export const caption = style({
  fontSize: "0.95rem",
  color: "#6c757d",
  textAlign: "center",
});

// Virtues grid
export const virtuesGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
});

export const virtueCard = style({
  backgroundColor: "white",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "12px",
  paddingBottom: "44px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  position: "relative",
  overflow: "hidden",
});

export const virtueTitle = style({
  margin: "0 0 6px 0",
  fontSize: "1rem",
  color: "#2c3e50",
  "@media": {
    "screen and (min-width: 1024px)": { fontSize: "1.05rem" },
  },
});

export const virtueText = style({
  margin: 0,
  fontSize: "1rem",
  color: "#2c3e50",
  "@media": {
    "screen and (min-width: 1024px)": { fontSize: "1.05rem" },
  },
});

// Traits display
export const traitRow = style({
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "6px",
});

export const traitChip = style({
  padding: "2px 10px",
  borderRadius: "9999px",
  backgroundColor: "#e8f4ff",
  color: "#1b5fa8",
  border: "1px solid #a8d0ff",
  fontSize: "var(--trait-font-size, 0.9rem)",
});

// Single-line trait footer pinned to card bottom for 2+ combinations
export const traitFooter = style({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  gap: "8px",
  alignItems: "center",
  padding: "6px 10px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.95) 100%)",
  borderTop: "1px solid #eef2f6",
  overflow: "hidden",
  whiteSpace: "nowrap",
  zIndex: 1,
});

// Watermark emblem overlay for faction symbols
export const watermark = style({
  position: "absolute",
  inset: 0,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "80% auto",
  opacity: 0.12,
  pointerEvents: "none",
  filter: "grayscale(100%) contrast(120%)",
  mixBlendMode: "multiply",
});

// Inline emblem/logo shown next to ideology text
export const emblemInline = style({
  display: "inline-block",
  width: "18px",
  height: "18px",
  marginLeft: "6px",
  verticalAlign: "text-bottom",
  filter: "grayscale(100%) contrast(120%)",
  opacity: 0.9,
});

// Cosmology & Magic structured UI
export const cosmologyGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  "@media": {
    "screen and (min-width: 1024px)": {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});

export const toc = style({
  position: "sticky",
  top: "calc(env(safe-area-inset-top, 0px) + 8px)",
  backgroundColor: "#ffffff",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "10px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
});

export const tocTitle = style({
  margin: "0 0 8px 0",
  fontSize: "0.95rem",
  color: "#2c3e50",
});

export const tocList = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "6px",
});

export const tocLink = style({
  display: "block",
  textDecoration: "none",
  color: "#1b5fa8",
  padding: "6px 8px",
  borderRadius: "6px",
  backgroundColor: "#f2f8ff",
  border: "1px solid #d6e8ff",
  selectors: {
    "&:hover": { backgroundColor: "#e8f4ff" },
  },
});

export const sectionGroup = style({
  backgroundColor: "white",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
});

export const sectionHeader = style({
  margin: "0 0 8px 0",
  fontSize: "1.05rem",
  color: "#2c3e50",
});

export const microSummary = style({
  margin: "0 0 10px 0",
  color: "#34495e",
  fontSize: "0.98rem",
});

export const disclosure = style({
  border: "1px solid #eef2f6",
  borderRadius: "6px",
  backgroundColor: "#fbfdff",
  overflow: "hidden",
});

export const disclosureSummary = style({
  padding: "10px 12px",
  cursor: "pointer",
  userSelect: "none",
  backgroundColor: "#f6faff",
  borderBottom: "1px solid #eef2f6",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 600,
});

export const disclosureBody = style({
  padding: "10px 12px",
});

export const badge = style({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "9999px",
  fontSize: "0.75rem",
  border: "1px solid #d9dde1",
  color: "#3b4b5b",
  backgroundColor: "#f2f4f6",
});

export const badgeCanon = style({
  backgroundColor: "#e8f7ed",
  color: "#0f7b3e",
  borderColor: "#bfe5cc",
});

export const badgeBelief = style({
  backgroundColor: "#fff7e6",
  color: "#9a6b00",
  borderColor: "#ffe0a3",
});

export const badgeApocrypha = style({
  backgroundColor: "#f9e8ee",
  color: "#8a2042",
  borderColor: "#f5c1d1",
});

export const callouts = style({
  display: "grid",
  gap: "8px",
  margin: "8px 0",
});

export const callout = style({
  border: "1px solid #e9ecef",
  borderLeftWidth: "4px",
  borderRadius: "6px",
  padding: "8px 10px",
  backgroundColor: "#ffffff",
});

export const calloutInfo = style({
  borderLeftColor: "#3498db",
  backgroundColor: "#f0f7ff",
});

export const calloutWarn = style({
  borderLeftColor: "#e67e22",
  backgroundColor: "#fff7ef",
});

export const calloutDanger = style({
  borderLeftColor: "#c0392b",
  backgroundColor: "#fff1f0",
});

export const chips = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "8px",
});

export const chip = style({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "9999px",
  fontSize: "0.85rem",
  backgroundColor: "#eef6ff",
  border: "1px solid #d6e8ff",
  color: "#1b5fa8",
  textDecoration: "none",
});

export const diagramCard = style({
  backgroundColor: "white",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "12px",
});

export const matrix = style({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
});

export const matrixTh = style({
  textAlign: "left",
  padding: "8px",
  borderBottom: "2px solid #e9ecef",
  color: "#2c3e50",
});

export const matrixTd = style({
  padding: "8px",
  borderBottom: "1px solid #eef2f6",
  verticalAlign: "top",
});

export const quickRef = style({
  backgroundColor: "#fbfdfc",
  border: "1px solid #e9f5ef",
  borderRadius: "8px",
  padding: "12px",
});

export const glossary = style({
  backgroundColor: "white",
  border: "1px solid #e9ecef",
  borderRadius: "8px",
  padding: "12px",
});

export const glossaryList = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "6px",
});
