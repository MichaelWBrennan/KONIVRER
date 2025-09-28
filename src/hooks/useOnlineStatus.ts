import { useState, useEffect, useCallback } from "react";

export interface OnlineStatus {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineTime: Date | null;
  lastOfflineTime: Date | null;
}

export function useOnlineStatus() {
  const [status, setStatus] = useState<OnlineStatus>(() => ({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    wasOffline: false,
    lastOnlineTime: null,
    lastOfflineTime: null,
  }));

  const handleOnline = useCallback(() => {
    setStatus((prev) => ({
      isOnline: true,
      wasOffline: prev.isOnline === false,
      lastOnlineTime: new Date(),
      lastOfflineTime: prev.lastOfflineTime,
    }));
  }, []);

  const handleOffline = useCallback(() => {
    setStatus((prev) => ({
      isOnline: false,
      wasOffline: false,
      lastOnlineTime: prev.lastOnlineTime,
      lastOfflineTime: new Date(),
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return status;
}