import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { GameState, Card } from "../types/game";

export type SimMode = "practice" | "scrim" | "rehearsal";
export type SimPanel = "lab" | "sideboard" | "judge" | "event" | "scenario" | "matchup";

export interface ScenarioState {
  id: string;
  name: string;
  createdAt: number;
  gameState: GameState;
}

export interface ClockState {
  roundSeconds: number;
  sideboardSeconds: number;
  running: boolean;
  lastTickAt?: number;
}

export interface MonteCarloSummary {
  iterations: number;
  avgOpeningHandQuality: number; // 0..1
  mulliganRate: number; // 0..1
  landSpellBalance: { mean: number; stdev: number };
}

interface SimState {
  mode: SimMode;
  clock: ClockState;
  savedScenarios: ScenarioState[];
  activeScenarioId: string | null;
  stats: MonteCarloSummary | null;
  activePanel: SimPanel;

  // Sideboard timer controls
  sideboardRunning: boolean;
  lastSideboardTickAt?: number;

  // Event rehearsal state
  eventId?: string;
  roundNumber?: number;
  pairings?: Array<{ tableNumber: number; playerA: { id: string; name: string }; playerB: { id: string; name: string }; status: string }>;

  // Judge state
  lastJudgeTicketId?: string;

  setMode: (m: SimMode) => void;
  setActivePanel: (p: SimPanel) => void;
  startClock: () => void;
  pauseClock: () => void;
  resetClock: () => void;
  tick: () => void;
  startSideboard: () => void;
  pauseSideboard: () => void;
  resetSideboard: () => void;
  tickSideboard: () => void;

  saveScenario: (s: ScenarioState) => void;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  setStats: (s: MonteCarloSummary | null) => void;

  setEventInfo: (id: string, round: number) => void;
  setPairings: (list: SimState["pairings"]) => void;
  setLastJudgeTicketId: (id: string) => void;
}

export const useSimStore = create<SimState>()(
  devtools(
    persist(
      (set, get) => ({
        mode: "practice",
        clock: { roundSeconds: 45 * 60, sideboardSeconds: 10 * 60, running: false },
        savedScenarios: [],
        activeScenarioId: null,
        stats: null,
        activePanel: "lab",
        sideboardRunning: false,

        setMode: (m) => set({ mode: m }, false, "setMode"),
        setActivePanel: (p) => set({ activePanel: p }, false, "setActivePanel"),

        startClock: () =>
          set((state) => ({
            clock: { ...state.clock, running: true, lastTickAt: Date.now() },
          }), false, "startClock"),

        pauseClock: () =>
          set((state) => ({
            clock: { ...state.clock, running: false, lastTickAt: undefined },
          }), false, "pauseClock"),

        resetClock: () =>
          set({ clock: { roundSeconds: 45 * 60, sideboardSeconds: 10 * 60, running: false } }, false, "resetClock"),

        tick: () =>
          set((state) => {
            if (!state.clock.running || !state.clock.lastTickAt) return state;
            const now = Date.now();
            const delta = Math.floor((now - state.clock.lastTickAt) / 1000);
            if (delta <= 0) return state;
            const nextRound = Math.max(0, state.clock.roundSeconds - delta);
            return {
              clock: { ...state.clock, roundSeconds: nextRound, lastTickAt: now },
            };
          }, false, "tick"),

        startSideboard: () =>
          set((state) => ({ sideboardRunning: true, lastSideboardTickAt: Date.now() }), false, "startSideboard"),
        pauseSideboard: () =>
          set({ sideboardRunning: false, lastSideboardTickAt: undefined }, false, "pauseSideboard"),
        resetSideboard: () =>
          set((state) => ({ clock: { ...state.clock, sideboardSeconds: 15 * 60 }, sideboardRunning: false, lastSideboardTickAt: undefined }), false, "resetSideboard"),
        tickSideboard: () =>
          set((state) => {
            if (!state.sideboardRunning || !state.lastSideboardTickAt) return state;
            const now = Date.now();
            const delta = Math.floor((now - state.lastSideboardTickAt) / 1000);
            if (delta <= 0) return state;
            const next = Math.max(0, state.clock.sideboardSeconds - delta);
            return { clock: { ...state.clock, sideboardSeconds: next }, lastSideboardTickAt: now } as any;
          }, false, "tickSideboard"),

        saveScenario: (s) =>
          set((state) => {
            const existing = state.savedScenarios.filter((x) => x.id !== s.id);
            return { savedScenarios: [...existing, s], activeScenarioId: s.id };
          }, false, "saveScenario"),

        deleteScenario: (id) =>
          set((state) => ({
            savedScenarios: state.savedScenarios.filter((s) => s.id !== id),
            activeScenarioId: state.activeScenarioId === id ? null : state.activeScenarioId,
          }), false, "deleteScenario"),

        setActiveScenario: (id) => set({ activeScenarioId: id }, false, "setActiveScenario"),

        setStats: (s) => set({ stats: s }, false, "setStats"),

        setEventInfo: (id, round) => set({ eventId: id, roundNumber: round }, false, "setEventInfo"),
        setPairings: (list) => set({ pairings: list || [] }, false, "setPairings"),
        setLastJudgeTicketId: (id) => set({ lastJudgeTicketId: id }, false, "setLastJudgeTicketId"),
      }),
      { name: "konivrer-sim-store" },
    ),
    { name: "konivrer-sim-store" },
  ),
);
