import React, { useEffect, useRef, useState } from "react";
import * as s from "./mobileNav.css.ts";
import { useAuth } from "../hooks/useAuth";

type Tab = "home" | "cards" | "decks" | "events" | "more";

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props> = ({ current, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const active = (t: Tab) => (current === t ? s.tabActive : "");
  const { isAuthenticated, canAccessJudgePortal } = useAuth();

  useEffect(() => {
    if (open) {
      sheetRef.current?.focus();
    }
  }, [open]);
  return (
    <nav className={s.nav} aria-label="Primary">
      <div className={s.navInner}>
        <button
          className={`${s.tab} ${active("home")}`}
          aria-current={current === "home" ? "page" : undefined}
          onClick={() => onNavigate("home")}
        >
          <span className={s.label}>Home</span>
        </button>
        <button
          className={`${s.tab} ${active("cards")}`}
          aria-current={current === "cards" ? "page" : undefined}
          onClick={() => onNavigate("cards")}
        >
          <span className={s.label}>Cards</span>
        </button>
        <button
          className={`${s.tab} ${active("decks")}`}
          aria-current={current === "decks" ? "page" : undefined}
          onClick={() => onNavigate("decks")}
        >
          <span className={s.label}>Decks</span>
        </button>
        <button
          className={`${s.tab} ${active("events")}`}
          aria-current={current === "events" ? "page" : undefined}
          onClick={() => onNavigate("events")}
        >
          <span className={s.label}>Events</span>
        </button>
        <button
          className={`${s.tab}`}
          onClick={() => {
            if (isAuthenticated) {
              onNavigate("profile");
            } else {
              const evt = new CustomEvent("open-login");
              window.dispatchEvent(evt);
            }
          }}
        >
          <span className={s.label}>
            {isAuthenticated ? "Profile" : "Login"}
          </span>
        </button>
        <button
          className={`${s.tab} ${active("more")}`}
          aria-current={current === "more" ? "page" : undefined}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className={s.label}>More</span>
        </button>
      </div>

      {open && (
        <div
          className={s.moreOverlay}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className={s.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="More menu"
            ref={sheetRef}
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              e.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.sheetHeader}>
              <button
                className={s.closeBtn}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            {(
              [
                ...(isAuthenticated ? [["my-decks", "My Decks"] as const] : []),
                ["simulator", "Play"] as const,
                ["rules", "Rules"] as const,
                ["lore", "Lore"] as const,
                ...(canAccessJudgePortal()
                  ? [["judge", "Judge"] as const]
                  : []),
                ["settings", "Settings"] as const,
              ] as const
            ).map(([page, label]) => (
              <button
                key={page}
                className={s.sheetItem}
                type="button"
                onClick={() => {
                  onNavigate(page);
                  setOpen(false);
                }}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
