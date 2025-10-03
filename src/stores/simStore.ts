import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { GameState, Card } from "../types/game";

export type SimMode = "practice" | "scrim" | "rehearsal";

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

  setMode: (m: SimMode) => void;
  startClock: () => void;
  pauseClock: () => void;
  resetClock: () => void;
  tick: () => void;

  saveScenario: (s: ScenarioState) => void;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  setStats: (s: MonteCarloSummary | null) => void;
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

        setMode: (m) => set({ mode: m }, false, "setMode"),

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
      }),
      { name: "konivrer-sim-store" },
    ),
    { name: "konivrer-sim-store" },
  ),
);
