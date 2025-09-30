import React from "react";
import * as s from "./mobileNav.css.ts";
import { useAuth } from "../hooks/useAuth";
import { AccessibilityIcon, LoginIcon } from "../components/EsotericIcons";

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
              t.id === idToReplace ? { id: "home", label: "Home" } : t,
            );
          }

          return tabsToRender.map(({ id, label }) => (
            <button
              key={id}
              className={`${s.tab} ${
                current === id 
                  ? id === "home" 
                    ? s.tabHomeActive 
                    : s.tabActive 
                  : ""
              }`}
              aria-current={current === id}
              onClick={() => onNavigate(id)}
            >
              <span className={s.label}>{label}</span>
            </button>
          ));
        })()}
        {(() => {
          const isRules = current === "rules";
          const label = isRules ? "Home" : "Rules";
          const target = isRules ? "home" : "rules";
          return (
            <button
              className={`${s.tab} ${
                !isRules 
                  ? active("rules") 
                  : current === "home" 
                    ? s.tabHomeActive 
                    : ""
              }`}
              aria-current={!isRules && current === "rules"}
              onClick={() => onNavigate(target)}
            >
              <span className={s.label}>{label}</span>
            </button>
          );
        })()}
        {/* Swapped: show Lore before Sim; when on Lore or Sim, that slot becomes Home */}
        {(
          [
            ...(isAuthenticated ? [["my-decks", "My Decks"] as const] : []),
            ["lore", "Lore"] as const,
            ["simulator", "Sim"] as const,
            ...(canAccessJudgePortal() ? [["judge", "Judge"] as const] : []),
          ] as const
        ).map(([page, defaultLabel]) => {
          const isLoreOrSim = page === "lore" || page === "simulator";
          const isCurrent = current === page;
          const isReplacedByHome = isLoreOrSim && isCurrent;
          const label = isReplacedByHome ? "Home" : defaultLabel;
          const target = isReplacedByHome ? "home" : page;
          return (
            <button
              key={page}
              className={`${s.tab} ${isReplacedByHome ? s.tabHome : active(page as Tab)}`}
              aria-current={!isReplacedByHome && current === page}
              onClick={() => onNavigate(target)}
            >
              <span className={s.label}>{label}</span>
            </button>
          );
        })}
        {/* Login button moved after Lore */}
        <button
          className={`${s.tab}`}
          onClick={() => {
            const evt = new CustomEvent("open-login");
            window.dispatchEvent(evt);
          }}
          aria-label="Login"
        >
          <LoginIcon size={18} />
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
