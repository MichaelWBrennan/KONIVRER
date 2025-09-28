import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css.ts";

// Defer telemetry initialization to idle time
if (typeof window !== "undefined") {
  const idleInit = () => import("./services/telemetry").catch(() => {});
  if ("requestIdleCallback" in window) {
    (window as Window & { requestIdleCallback?: (callback: () => void) => void }).requestIdleCallback?.(idleInit);
  } else {
    setTimeout(idleInit, 2000);
  }
}

// Set CSS custom properties for mobile viewport handling
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// Initial call
setViewportHeight();

// Re-calculate on resize and orientation change
window.addEventListener("resize", setViewportHeight);
window.addEventListener("orientationchange", () => {
  setTimeout(setViewportHeight, 100);
});

// Service worker registration for PWA features
if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  } else {
    // In dev: unregister existing SW and clear caches to avoid stale content
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
    if ("caches" in window) {
      caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
    }
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
