import React, { useState } from "react";
import * as s from "./mobileNav.css.ts";
import { useAuth } from "../hooks/useAuth";

type Tab = "home" | "cards" | "decks" | "events" | "simulator" | "more";

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props> = ({ current, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const active = (t: Tab) => (current === t ? s.tabActive : "");
  const { isAuthenticated, canAccessJudgePortal } = useAuth();
  return (
    <nav className={s.nav} aria-label="Primary">
      <div className={s.navInner}>
        {(() => {
          const mainTabs: Array<{ id: string; label: string }> = [
            { id: "cards", label: "Cards" },
            { id: "decks", label: "Decks" },
            { id: "events", label: "Events" },
          ];

          let tabsToRender: Array<{ id: string; label: string }> = mainTabs;

          if (current !== "home") {
            tabsToRender = mainTabs.map((t) =>
              t.id === current ? { id: "home", label: "Blog" } : t
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
          className={`${s.tab}`}
          onClick={() => {
            const evt = new CustomEvent("open-login");
            window.dispatchEvent(evt);
          }}
        >
          <span className={s.label}>Login</span>
        </button>
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
                ["deckbuilder", "Deckbuilder"] as const,
                ["simulator", "Play"] as const,
                ["rules", "Rules"] as const,
                ["lore", "Lore"] as const,
                ...(canAccessJudgePortal()
                  ? [["judge", "Judge"] as const]
                  : []),
                ["settings", "Settings"] as const,
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
  );
};
