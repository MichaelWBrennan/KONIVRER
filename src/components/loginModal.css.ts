import { style, globalKeyframes } from "@vanilla-extract/css";

globalKeyframes("loginOverlayFadeIn", {
  from: { opacity: 0 },
  to: { opacity: 1 },
});
globalKeyframes("loginModalSlideIn", {
  from: { opacity: 0, transform: "scale(0.8) translateY(50px)" },
  to: { opacity: 1, transform: "scale(1) translateY(0)" },
});

export const overlay: any : any = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  backdropFilter: "blur(10px)",
  animation: "loginOverlayFadeIn 0.3s ease-out",
});
export const modal: any : any = style({
  background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
  border: "2px solid #d4af37",
  borderRadius: 20,
  width: "100%",
  maxWidth: 450,
  maxHeight: "90vh",
  overflowY: "auto",
  position: "relative",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.3), inset 0 1px 0 rgba(212,175,55,0.1)",
  animation: "loginModalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
});
export const close: any : any = style({
  position: "absolute",
  top: 20,
  right: 20,
  background: "none",
  border: "none",
  color: "#d4af37",
  fontSize: 24,
  cursor: "pointer",
  padding: 8,
  borderRadius: "50%",
  zIndex: 1,
});
export const header: any : any = style({
  textAlign: "center",
  padding: "40px",
  paddingBottom: 30,
  borderBottom: "1px solid rgba(212,175,55,0.2)",
});
export const form: any : any = style({ padding: "30px 40px" });
export const inputGroup: any : any = style({ marginBottom: 24 });
export const passwordInput: any : any = style({ position: "relative" });
export const textInput: any : any = style({
  width: "100%",
  height: 44,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid rgba(212,175,55,0.25)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  fontSize: 16,
});
export const passwordToggle: any : any = style({
  position: "absolute",
  right: 16,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#d4af37",
  cursor: "pointer",
  padding: 8,
  borderRadius: 6,
});
export const loginBtn: any : any = style({
  width: "100%",
  background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
  color: "#000",
  border: "none",
  borderRadius: 12,
  padding: 18,
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: 1,
  marginTop: 10,
  boxShadow: "0 4px 15px rgba(212,175,55,0.3)",
});
export const divider: any : any = style({
  textAlign: "center",
  position: "relative",
  margin: "30px 40px",
  color: "#888",
  fontSize: 14,
});
export const dividerSpan: any : any = style({
  background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
  padding: "0 20px",
  position: "relative",
  zIndex: 1,
});
export const socialSection: any : any = style({
  padding: "0 40px 20px 40px",
  display: "flex",
  flexDirection: "column",
  gap: 12,
});
export const socialBtn: any : any = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: "rgba(0,0,0,0.7)",
  border: "2px solid rgba(212,175,55,0.2)",
  borderRadius: 12,
  color: "#fff",
  padding: "14px 20px",
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  textAlign: "left",
});
export const socialIcon: any : any = style({
  fontSize: 20,
  width: 24,
  textAlign: "center",
});
export const biometricSection: any : any = style({
  padding: "20px 40px 30px 40px",
  borderTop: "1px solid rgba(212,175,55,0.2)",
});
export const biometricButtons: any : any = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 25,
});
export const biometricBtn: any : any = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  background: "rgba(212,175,55,0.1)",
  border: "2px solid rgba(212,175,55,0.3)",
  borderRadius: 12,
  color: "#d4af37",
  padding: "20px 12px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: 0.5,
});
export const biometricIcon: any : any = style({ fontSize: 24 });
export const biometricTip: any : any = style({
  background: "rgba(212,175,55,0.05)",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: 12,
  padding: 20,
  marginTop: 20,
  color: "#cccccc",
});
export const footer: any : any = style({
  textAlign: "center",
  padding: "20px 40px 40px 40px",
  borderTop: "1px solid rgba(212,175,55,0.2)",
});
