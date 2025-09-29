import { style, globalKeyframes } from "@vanilla-extract/css";

globalKeyframes("fadeIn", {
  from: { opacity: 0 },
  to: { opacity: 1 },
});

globalKeyframes("slideUp", {
  from: { 
    opacity: 0, 
    transform: "translateY(20px) scale(0.95)" 
  },
  to: { 
    opacity: 1, 
    transform: "translateY(0) scale(1)" 
  },
});

globalKeyframes("spin", {
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const overlay = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  backdropFilter: "blur(4px)",
  animation: "fadeIn 0.2s ease-out",
  padding: "16px",
});

export const modal = style({
  background: "#ffffff",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "400px",
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  animation: "slideUp 0.3s ease-out",
  border: "1px solid #e5e7eb",
});

export const close = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "none",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  ":hover": {
    background: "#f3f4f6",
    color: "#374151",
  },
  ":active": {
    transform: "scale(0.95)",
  },
});

export const header = style({
  padding: "32px 32px 24px 32px",
  textAlign: "center",
});

export const title = style({
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 8px 0",
  lineHeight: "1.25",
});

export const subtitle = style({
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
  lineHeight: "1.5",
});

export const form = style({
  padding: "0 32px 24px 32px",
});

export const inputGroup = style({
  marginBottom: "20px",
});

export const label = style({
  display: "block",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
  marginBottom: "6px",
  lineHeight: "1.25",
});

export const input = style({
  width: "100%",
  height: "44px",
  padding: "0 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#111827",
  fontSize: "16px",
  transition: "all 0.2s ease",
  outline: "none",
  ":focus": {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },
  ":disabled": {
    background: "#f9fafb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  "::placeholder": {
    color: "#9ca3af",
  },
});

export const passwordWrapper = style({
  position: "relative",
});

export const passwordToggle = style({
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  ":hover": {
    color: "#374151",
    background: "#f3f4f6",
  },
  ":active": {
    transform: "translateY(-50%) scale(0.95)",
  },
});

export const options = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
});

export const checkboxWrapper = style({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "14px",
  color: "#374151",
});

export const checkbox = style({
  width: "16px",
  height: "16px",
  marginRight: "8px",
  accentColor: "#3b82f6",
});

export const checkboxLabel = style({
  userSelect: "none",
});

export const forgotLink = style({
  fontSize: "14px",
  color: "#3b82f6",
  textDecoration: "none",
  fontWeight: "500",
  ":hover": {
    textDecoration: "underline",
  },
});

export const submitBtn = style({
  width: "100%",
  background: "#3b82f6",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  ":hover": {
    background: "#2563eb",
  },
  ":active": {
    transform: "scale(0.98)",
  },
  ":disabled": {
    background: "#9ca3af",
    cursor: "not-allowed",
    transform: "none",
  },
});

export const spinner = style({
  animation: "spin 1s linear infinite",
});

export const errorMessage = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 16px",
  marginBottom: "20px",
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  color: "#dc2626",
  fontSize: "14px",
  fontWeight: "500",
});

export const divider = style({
  position: "relative",
  margin: "24px 32px",
  textAlign: "center",
  "::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: "1px",
    background: "#e5e7eb",
  },
});

export const dividerText = style({
  background: "#ffffff",
  color: "#6b7280",
  fontSize: "14px",
  padding: "0 16px",
  position: "relative",
  zIndex: 1,
});

export const socialSection = style({
  padding: "0 32px 32px 32px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const socialBtn = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  background: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#374151",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    background: "#f9fafb",
    borderColor: "#9ca3af",
  },
  ":active": {
    transform: "scale(0.98)",
  },
  ":disabled": {
    background: "#f9fafb",
    color: "#9ca3af",
    cursor: "not-allowed",
    transform: "none",
  },
});

export const socialIcon = style({
  width: "20px",
  height: "20px",
  objectFit: "contain",
});

export const socialFallback = style({
  display: "none",
  width: "20px",
  height: "20px",
  fontSize: "14px",
  fontWeight: "bold",
  textAlign: "center",
  lineHeight: "20px",
  borderRadius: "4px",
  background: "#f3f4f6",
  color: "#6b7280",
});

export const footer = style({
  padding: "0 32px 32px 32px",
  textAlign: "center",
});

export const footerText = style({
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
});

export const signupLink = style({
  color: "#3b82f6",
  textDecoration: "none",
  fontWeight: "500",
  ":hover": {
    textDecoration: "underline",
  },
});
