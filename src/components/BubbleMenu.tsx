import React, { useState, useEffect } from "react";
import { detectDevice } from "../utils/deviceDetection";
import { LoginModal } from "./LoginModal";
import { useAuth } from "../hooks/useAuth";
import {
  AccessibilityIcon,
  SearchIcon,
  ProfileIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
} from "./EsotericIcons";
import * as bm from "./bubbleMenu.css.ts";

interface BubbleMenuProps {
  currentPage: string;
  onPageChange: (
    page:
      | "home"
      | "simulator"
      | "cards"
      | "decks"
      | "deckbuilder"
      | "analytics"
      | "events"
      | "my-decks"
      | "rules"
      | "judge"
      | "social",
  ) => void;
  onSearch?: (query: string) => void;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  currentPage,
  onPageChange,
  onSearch,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState("medium");
  const [contrastMode, setContrastMode] = useState("normal");
  const device = detectDevice();
  const {
    isAuthenticated,
    user,
    canAccessJudgePortal,
    logout,
    isJudge,
    getJudgeLevel,
  } = useAuth();

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    const savedContrast = localStorage.getItem("contrastMode") || "normal";

    // Clean up old dyslexicFont setting since it's no longer needed
    localStorage.removeItem("dyslexicFont");

    setFontSize(savedFontSize);
    setContrastMode(savedContrast);

    // Apply settings to document
    document.documentElement.setAttribute("data-font-size", savedFontSize);
    document.documentElement.setAttribute("data-contrast", savedContrast);
    // OpenDyslexic font is now always applied via CSS
  }, []);

  const handleAccessibilityChange = (
    setting: string,
    value: string | boolean,
  ) => {
    switch (setting) {
      case "fontSize":
        setFontSize(value as string);
        localStorage.setItem("fontSize", value as string);
        document.documentElement.setAttribute(
          "data-font-size",
          value as string,
        );
        break;
      case "contrast":
        setContrastMode(value as string);
        localStorage.setItem("contrastMode", value as string);
        document.documentElement.setAttribute("data-contrast", value as string);
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const getSearchPlaceholder = () => {
    switch (currentPage) {
      case "cards":
        return "Search cards...";
      case "decks":
        return "Search decks...";
      case "my-decks":
        return "Search my decks...";
      case "tournaments":
        return "Search tournaments...";
      case "companion":
        return "Search events...";
      default:
        return "Search...";
    }
  };

  // Helper function to close all panels except the specified one
  const closeOtherPanels = (keepOpen: string) => {
    if (keepOpen !== "accessibility") setIsAccessibilityOpen(false);
    if (keepOpen !== "search") setIsSearchOpen(false);
    if (keepOpen !== "login") setIsLoginOpen(false);
    if (keepOpen !== "menu") setIsMenuOpen(false);
  };

  const isOnEventsPage =
    currentPage === "events" || currentPage === "event-archive";

  const menuItems = [
    // Only show Home when not on home page
    ...(currentPage !== "home" ? [{ id: "home" as const, label: "Home" }] : []),
    { id: "cards" as const, label: "Cards" },
    { id: "decks" as const, label: "Deck Search" },
    // Only show My Decks when logged in
    ...(isAuthenticated
      ? [{ id: "my-decks" as const, label: "My Decks" }]
      : []),
    { id: "simulator" as const, label: "Sim" },
    { id: "rules" as const, label: "Rules" },
    // Only show Social Media when logged in
    ...(isAuthenticated
      ? [{ id: "social" as const, label: "Social" }]
      : []),
    // Only show Judge Portal to authenticated judges and admins
    ...(canAccessJudgePortal()
      ? [{ id: "judge" as const, label: "Judge Portal" }]
      : []),
    // Replace Events with Home on Events pages
    ...(!isOnEventsPage ? [{ id: "events" as const, label: "Events" }] : []),
    // Combined tournaments and companion functionality into unified Events
  ];

  return (
    <div className={`${bm.root} ${device.isMobile ? bm.mobile : bm.desktop}`}>
      {/* Accessibility Settings Bubble */}
      <div key="accessibility-bubble" className={`accessibility-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.accessibilityBtn}`}
          onClick={() => {
            closeOtherPanels("accessibility");
            setIsAccessibilityOpen(!isAccessibilityOpen);
          }}
          aria-label="Accessibility Settings"
          aria-expanded={isAccessibilityOpen}
        >
          <AccessibilityIcon size={20} />
        </button>

        {isAccessibilityOpen && (
          <div className={`${bm.panel} accessibility-panel`}>
            <button
              className={bm.panelCloseBtn}
              onClick={() => setIsAccessibilityOpen(false)}
              aria-label="Close accessibility settings"
            >
              ✕
            </button>
            <h3>Accessibility Settings</h3>

            <div className="setting-group">
              <label htmlFor="font-size">Font Size:</label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) =>
                  handleAccessibilityChange("fontSize", e.target.value)
                }
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="contrast">Contrast:</label>
              <select
                id="contrast"
                value={contrastMode}
                onChange={(e) =>
                  handleAccessibilityChange("contrast", e.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="high">High Contrast</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Bubble */}
      <div key="search-bubble" className={`search-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.searchBtn}`}
          onClick={() => {
            closeOtherPanels("search");
            setIsSearchOpen(!isSearchOpen);
          }}
          aria-label="Search"
          aria-expanded={isSearchOpen}
        >
          <SearchIcon size={20} />
        </button>

        {isSearchOpen && (
          <div className={`${bm.panel} search-panel`}>
            <button
              className={bm.panelCloseBtn}
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              ✕
            </button>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Login/Profile Bubble */}
      <div key="login-bubble" className={`login-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.loginBtn}`}
          onClick={() => {
            closeOtherPanels("login");
            setIsLoginOpen(!isLoginOpen);
          }}
          aria-label="User Profile"
          aria-expanded={isLoginOpen}
        >
          <ProfileIcon size={20} />
        </button>

        {isLoginOpen && (
          <div className={`${bm.panel} login-panel`}>
            <button
              className={bm.panelCloseBtn}
              onClick={() => setIsLoginOpen(false)}
              aria-label="Close login panel"
            >
              ✕
            </button>
            <div className={bm.userProfile}>
              <div className={bm.userAvatarLarge}>
                <ProfileIcon size={32} />
              </div>
              {isAuthenticated ? (
                <>
                  <h3>{user?.displayName || user?.username || "User"}</h3>
                  <p>
                    {isJudge() ? `Judge Level ${getJudgeLevel()}` : "Player"} •
                    Level{" "}
                    {user?.eloRating ? Math.floor(user.eloRating / 100) : 1}
                  </p>
                  <p style={{ fontSize: "0.8em", color: "#666" }}>
                    {user?.rankTier || "Bronze"} Tier
                  </p>
                  <div className={bm.userActions}>
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={async () => {
                        await logout();
                        setIsLoginOpen(false);
                      }}
                      aria-label="Logout"
                      title="Logout"
                    >
                      <LogoutIcon size={18} />
                    </button>
                    <button className="btn btn-small btn-secondary">
                      Settings
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Not Logged In</h3>
                  <p>Sign in to access all features</p>
                  <div className={bm.userActions}>
                    <button
                      className="btn btn-small"
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsLoginOpen(false);
                      }}
                      aria-label="Login"
                      title="Login"
                    >
                      <LoginIcon size={18} />
                    </button>
                    <button className="btn btn-small btn-secondary">
                      Settings
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Burger Menu Bubble */}
      <div key="menu-bubble" className={`menu-bubble`}>
        <button
          className={`${bm.bubbleBtn} ${bm.menuBtn}`}
          onClick={() => {
            closeOtherPanels("menu");
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Main Menu"
          aria-expanded={isMenuOpen}
        >
          <MenuIcon size={20} />
        </button>

        {isMenuOpen && (
          <div className={`${bm.panel} menu-panel`}>
            <button
              className={bm.panelCloseBtn}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className={bm.menuNav}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`${bm.menuItem} ${
                    item.id === "home" ? bm.menuItemHome : ""
                  } ${
                    currentPage === item.id
                      ? item.id === "home"
                        ? bm.menuItemHomeActive
                        : bm.menuItemActive
                      : ""
                  }`}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className={bm.menuLabel}>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
