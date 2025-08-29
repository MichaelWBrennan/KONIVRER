import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./global.css.ts";

// Initialize mobile UX optimization services
import "./services/telemetry";

// Set CSS custom properties for mobile viewport handling
const setViewportHeight: any : any : any : any = () => {
  const vh: any : any : any : any = window.innerHeight * 0.01;
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
  navigator.serviceWorker.register("/sw.js").catch(console.error);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
