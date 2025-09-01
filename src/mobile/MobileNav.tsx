import React, { useState } from "react";
import * as s from "./mobileNav.css.ts";
import { useAuth } from "../hooks/useAuth";

type Tab =
  | "home"
  | "cards"
  | "decks"
  | "events"
  | "simulator"
  | "rules"
  | "more";

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props> = ({ current, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const active = (t: Tab) => (current === t ? s.tabActive : "");
  const { isAuthenticated, canAccessJudgePortal, logout } = useAuth();
  return (
    <>
      {current !== "settings" && (
        <button
          className={s.accessibilityFab}
          onClick={() => onNavigate("settings")}
          aria-label="Accessibility settings"
        >
          Accessibility
        </button>
      )}
      <nav className={s.nav} aria-label="Primary">
        <div className={isAuthenticated ? s.navInnerSeven : s.navInnerSix}>
        {(() => {
          const mainTabs: Array<{ id: string; label: string }> = [
            { id: "cards", label: "Cards" },
            { id: "decks", label: "Decks" },
            { id: "events", label: "Events" },
          ];

          let tabsToRender: Array<{ id: string; label: string }> = mainTabs;

          if (current !== "home") {
            const isOnEvents = current === "events" || current === "event-archive";
            const idToReplace = isOnEvents ? "events" : current;
            tabsToRender = mainTabs.map((t) =>
              t.id === idToReplace ? { id: "home", label: "Blog" } : t
            );
          }

          return tabsToRender.map(({ id, label }) => (
            <button
              key={id}
              className={`${s.tab} ${active(id as Tab)}`}
              aria-current={current === id}
              onClick={() => onNavigate(id)}
            >
              <span className={s.label}>{label}</span>
            </button>
          ));
        })()}
        <button
          className={`${s.tab} ${active("rules")}`}
          aria-current={current === "rules"}
          onClick={() => onNavigate("rules")}
        >
          <span className={s.label}>Rules</span>
        </button>
        {isAuthenticated && (
          <button
            className={`${s.tab} ${current === "profile" ? s.tabActive : ""}`}
            aria-current={current === "profile"}
            onClick={() => onNavigate("profile")}
          >
            <span className={s.label}>Account</span>
          </button>
        )}
        {!isAuthenticated ? (
          <button
            className={`${s.tab}`}
            onClick={() => {
              const evt = new CustomEvent("open-login");
              window.dispatchEvent(evt);
            }}
          >
            <span className={s.label}>Login</span>
          </button>
        ) : (
          <button
            className={`${s.tab}`}
            onClick={() => {
              logout();
            }}
          >
            <span className={s.label}>Logout</span>
          </button>
        )}
        <button
          className={`${s.tab} ${active("more")}`}
          aria-current={current === "more"}
          onClick={() => setOpen(true)}
        >
          <span className={s.label}>More</span>
        </button>
        </div>

      {open && (
        <div className={s.moreOverlay} onClick={() => setOpen(false)}>
          <div className={s.sheet} onClick={(e) => e.stopPropagation()}>
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
                ["lore", "Lore"] as const,
                ...(canAccessJudgePortal()
                  ? [["judge", "Judge"] as const]
                  : []),
              ] as const
            ).map(([page, label]) => (
              <div
                key={page}
                className={s.sheetItem}
                onClick={() => {
                  onNavigate(page);
                  setOpen(false);
                }}
              >
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </nav>
    </>
  );
};
