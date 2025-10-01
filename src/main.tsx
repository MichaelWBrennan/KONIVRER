import React from "react";
import * as ReactDOM from "react-dom";
import App from "./App.tsx";
import "./global.css.ts";
import { getBasePath } from "./utils/basePath";

// Defer telemetry initialization to idle time
if (typeof window !== "undefined") {
  const idleInit = () => import("./services/telemetry").catch(() => {});
  if ("requestIdleCallback" in window) {
    (
      window as Window & {
        requestIdleCallback?: (callback: () => void) => void;
      }
    ).requestIdleCallback?.(idleInit);
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
  if ((import.meta as any).env?.PROD) {
    const base = getBasePath();
    const normalizedBase = base.endsWith("/") ? base : base + "/";
    const swUrl = `${normalizedBase}sw.js`;
    navigator.serviceWorker.register(swUrl, { scope: normalizedBase }).catch(console.error);
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

const rootEl = document.getElementById("root")!;
const anyReactDOM = ReactDOM as any;
if (typeof anyReactDOM.createRoot === "function") {
  anyReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else if (typeof anyReactDOM.render === "function") {
  anyReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootEl,
  );
}
