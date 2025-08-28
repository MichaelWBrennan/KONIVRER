import { useCallback, useEffect, useState } from "react";
import * as s from "./offline.css.ts";

export function Offline(): any {
  const [isOnline, setIsOnline]: any : any = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );

  const updateConnectionStatus : any = useCallback(() => {
    const online : any =
      typeof navigator !== "undefined" ? navigator.onLine : false;
    setIsOnline(online);
    if (online) {
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, []);

  const checkConnection : any = useCallback(async () => {
    updateConnectionStatus();
    try {
      await fetch("/manifest.json", { method: "HEAD", cache: "no-cache" });
      window.location.href = "/";
    } catch {
      // still offline, do nothing
    }
  }, [updateConnectionStatus]);

  useEffect(() => {
    updateConnectionStatus();
    const onlineListener : any = () => updateConnectionStatus();
    const offlineListener : any = () => updateConnectionStatus();
    window.addEventListener("online", onlineListener);
    window.addEventListener("offline", offlineListener);

    const intervalId : any = window.setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener("online", onlineListener);
      window.removeEventListener("offline", offlineListener);
      window.clearInterval(intervalId);
    };
  }, [checkConnection, updateConnectionStatus]);

  return (
    <div className={s.page}>
      <div className={`${s.status} ${isOnline ? s.statusOnline : ""}`}>
        {isOnline ? "Online" : "Offline"}
      </div>

      <div className={s.container}>
        <div className={s.logo}>K</div>

        <h1>You're Offline</h1>
        <p className={s.subtitle}>No internet connection detected</p>

        <div className={s.icon} aria-hidden>
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M30 60h60M60 30v60"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.8" />
          </svg>
        </div>

        <p className={s.message}>
          Don't worry! KONIVRER works offline too. You can still access your
          saved decks, play against AI opponents, and use many features without
          an internet connection.
        </p>

        <div className={s.features}>
          <h3>Available Offline:</h3>
          <ul className={s.featureList}>
            <li className={s.featureItem}>View and edit saved decks</li>
            <li className={s.featureItem}>Play against AI opponents</li>
            <li className={s.featureItem}>Browse your card collection</li>
            <li className={s.featureItem}>Practice deck strategies</li>
            <li className={s.featureItem}>Access game rules and tutorials</li>
          </ul>
        </div>

        <button className={s.retryButton} onClick={checkConnection}>
          Check Connection
        </button>
        <a href="/" className={s.homeLink}>
          Return to App
        </a>
      </div>
    </div>
  );
}
