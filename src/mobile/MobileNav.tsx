import React from "react";
import * as s from "./mobileNav.css.ts";
import { useAuth } from "../hooks/useAuth";
import { AccessibilityIcon } from "../components/EsotericIcons";

type Tab =
  | "home"
  | "cards"
  | "decks"
  | "events"
  | "simulator"
  | "rules"
  | "my-decks"
  | "settings"
  | "lore"
  | "judge";

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

export const MobileNav: React.FC<Props> = ({ current, onNavigate }) => {
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
            const isOnEvents =
              current === "events" || current === "event-archive";
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
        {(() => {
          const isRules = current === "rules";
          const label = isRules ? "Blog" : "Rules";
          const target = isRules ? "home" : "rules";
          return (
            <button
              className={`${s.tab} ${!isRules ? active("rules") : ""}`}
              aria-current={!isRules && current === "rules"}
              onClick={() => onNavigate(target)}
            >
              <span className={s.label}>{label}</span>
            </button>
          );
        })()}
        {/* Swapped: show Lore before Sim */}
        {(
          [
            ...(isAuthenticated ? [["my-decks", "My Decks"] as const] : []),
            ["lore", "Lore"] as const,
            ["simulator", "Sim"] as const,
            ...(canAccessJudgePortal() ? [["judge", "Judge"] as const] : []),
          ] as const
        ).map(([page, label]) => (
          <button
            key={page}
            className={`${s.tab} ${active(page as Tab)}`}
            aria-current={current === page}
            onClick={() => onNavigate(page)}
          >
            <span className={s.label}>{label}</span>
          </button>
        ))}
        {/* Login button moved after Lore */}
        <button
          className={`${s.tab}`}
          onClick={() => {
            const evt = new CustomEvent("open-login");
            window.dispatchEvent(evt);
          }}
        >
          <span className={s.label}>Login</span>
        </button>
        {/* Accessibility icon only (remove visible text) */}
        <button
          className={`${s.tab} ${active("settings")}`}
          aria-current={current === "settings"}
          onClick={() => onNavigate("settings")}
        >
          <AccessibilityIcon size={18} />
        </button>
      </div>
    </nav>
  );
};
