import { style, globalStyle } from "@vanilla-extract/css";

export const root: any = style({
  position: "fixed",
  zIndex: 1000,
  pointerEvents: "none",
  display: "block",
  contain: "layout style",
});
export const mobile: any = style({
  bottom: "max(20px, env(safe-area-inset-bottom, 0px) + 10px)",
  left: "max(20px, env(safe-area-inset-left, 0px) + 10px)",
  right: "max(20px, env(safe-area-inset-right, 0px) + 10px)",
});
export const desktop: any = style({ top: 20, right: 20 });
export const bubbleContainer: any = style({
  position: "absolute",
  pointerEvents: "auto",
  contain: "layout style",
  order: "initial" as any,
  willChange: "auto",
});

export const bubbleBtn: any = style({
  width: 56,
  height: 56,
  minWidth: 44,
  minHeight: 44,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.1)",
  background:
    "radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.02) 100%), var(--accent-color)",
  color: "white",
  fontSize: 20,
  cursor: "pointer",
  transition:
    "transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 8px 18px rgba(74,144,226,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: 2,
  touchAction: "manipulation",
  userSelect: "none",
  selectors: {
    "&:hover": {
      boxShadow:
        "0 12px 34px rgba(0,0,0,0.4), 0 10px 22px rgba(74,144,226,0.35)",
      transform: "translateY(-2px)",
    },
    "&:active": { transform: "translateY(0)" },
  },
});

export const accessibilityBtn: any = style({ background: "#059669" });
export const searchBtn: any = style({ background: "#3b82f6" });
export const loginBtn: any = style({ background: "#8b5cf6" });
export const menuBtn: any = style({ background: "#f97316" });

export const panel: any = style({
  position: "relative",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 10px 40px rgba(0,0,0,0.55)",
  backdropFilter: "blur(14px) saturate(120%)",
  WebkitBackdropFilter: "blur(14px) saturate(120%)",
  zIndex: 1,
  minWidth: 280,
  maxWidth: "calc(100vw - 40px)",
});

export const panelCloseBtn: any = style({
  position: "absolute",
  top: 8,
  right: 8,
  background: "transparent",
  border: "none",
  color: "var(--text-primary)",
  fontSize: 16,
  cursor: "pointer",
  padding: 4,
  borderRadius: 6,
  lineHeight: "1",
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  selectors: { "&:hover": { background: "rgba(255,255,255,0.06)" } },
});

export const settingGroup: any = style({ marginBottom: 16 });
export const menuNav: any = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});
export const menuItem: any = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  background: "rgba(255,255,255,0.02)",
  color: "var(--text-primary)",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontSize: 16,
  width: "100%",
  selectors: { "&:hover": { background: "rgba(255,255,255,0.05)" } },
});
export const menuItemActive: any = style({
  background: "var(--accent-color)",
  color: "white",
  borderColor: "transparent",
  boxShadow: "0 6px 20px rgba(74,144,226,0.35)",
});
export const menuLabel: any = style({ fontWeight: 500 });

// User panel styles
export const userProfile: any = style({ textAlign: "center" });
export const userAvatarLarge: any = style({
  width: 80,
  height: 80,
  borderRadius: "50%",
  background: "var(--accent-color)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 32,
  margin: "0 auto 16px auto",
});
export const userActions: any = style({
  display: "flex",
  gap: 10,
  justifyContent: "center",
});

globalStyle(`${root}.mobile .accessibility-bubble`, {
  bottom: 70,
  left: 0,
  position: "absolute",
  order: 1 as any,
  pointerEvents: "auto",
});
globalStyle(`${root}.mobile .search-bubble`, {
  bottom: 70,
  right: 0,
  position: "absolute",
  order: 2 as any,
  pointerEvents: "auto",
});
globalStyle(`${root}.mobile .login-bubble`, {
  bottom: 0,
  left: 0,
  position: "absolute",
  order: 3 as any,
  pointerEvents: "auto",
});
globalStyle(`${root}.mobile .menu-bubble`, {
  bottom: 0,
  right: 0,
  position: "absolute",
  order: 4 as any,
  pointerEvents: "auto",
});

globalStyle(`${root}.desktop .accessibility-bubble`, {
  top: 0,
  right: 0,
  position: "absolute",
  order: 1 as any,
  pointerEvents: "auto",
});
globalStyle(`${root}.desktop .search-bubble`, {
  top: 70,
  right: 0,
  position: "absolute",
  order: 2 as any,
  pointerEvents: "auto",
});
globalStyle(`${root}.desktop .login-bubble`, {
  top: 140,
  right: 0,
  position: "absolute",
  order: 3 as any,
  pointerEvents: "auto",
});
globalStyle(`${root}.desktop .menu-bubble`, {
  top: 210,
  right: 0,
  position: "absolute",
  order: 4 as any,
  pointerEvents: "auto",
});
