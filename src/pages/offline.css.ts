import { style, globalKeyframes } from "@vanilla-extract/css";

globalKeyframes("fadeIn", {
  "0%": { opacity: 0, transform: "translateY(20px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

globalKeyframes("pulse", {
  "0%": { opacity: 0.6 },
  "50%": { opacity: 0.3 },
  "100%": { opacity: 0.6 },
});

export const page= style({
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  color: "white",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  textAlign: "center",
});

export const container= style({
  maxWidth: 400,
  width: "100%",
  animationName: "fadeIn",
  animationDuration: "0.6s",
  animationTimingFunction: "ease-out",
});

export const logo= style({
  width: 80,
  height: 80,
  background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px",
  fontSize: 32,
  fontWeight: "bold",
  color: "white",
});

export const subtitle= style({
  fontSize: 18,
  color: "#A0A0A0",
  marginBottom: 32,
});

export const icon= style({
  width: 120,
  height: 120,
  margin: "0 auto 24px",
  opacity: 0.6,
  animationName: "pulse",
  animationDuration: "2s",
  animationTimingFunction: "ease-in-out",
  animationIterationCount: "infinite",
});

export const message= style({
  fontSize: 16,
  lineHeight: 1.6,
  color: "#C0C0C0",
  marginBottom: 32,
});

export const features= style({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: 16,
  padding: 24,
  marginBottom: 32,
  backdropFilter: "blur(10px)",
});

export const featureList= style({ listStyle: "none", textAlign: "left" });

export const featureItem= style({
  padding: "8px 0 8px 24px",
  color: "#E0E0E0",
  position: "relative",
  selectors: {
    "&::before": {
      content: "\u2713",
      position: "absolute",
      left: 0,
      color: "#34C759",
      fontWeight: "bold",
    },
  },
});

export const retryButton= style({
  background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
  color: "white",
  border: 0,
  padding: "16px 32px",
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginBottom: 16,
  width: "100%",
});

export const homeLink= style({
  color: "#007AFF",
  textDecoration: "none",
  fontWeight: 500,
  padding: 12,
  display: "inline-block",
  borderRadius: 8,
  transition: "all 0.2s ease",
});

export const status= style({
  position: "fixed",
  top: 20,
  right: 20,
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 14,
  fontWeight: 500,
  background: "rgba(255, 59, 48, 0.9)",
  color: "white",
  backdropFilter: "blur(10px)",
});

export const statusOnline= style({
  background: "rgba(52, 199, 89, 0.9)",
});
