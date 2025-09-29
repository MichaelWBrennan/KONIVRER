import { create } from "zustand";

export type PlayerRef = { id: string; name: string };
export type Pairing = {
  tableNumber: number;
  playerA: PlayerRef;
  playerB: PlayerRef;
  status: "pending" | "reported" | "in_progress" | "final";
  result?: string; // e.g., "2-1", "ID", "Drop"
};

export type EventState = {
  currentEventId: string | undefined;
  currentEventName: string | undefined;
  roundNumber: number;
  roundEndsAt: number | undefined; // epoch ms
  pairings: Pairing[];
  myPlayerId: string | undefined;
  myTable: number | undefined;
  isLoading: boolean;
  error: string | undefined;
  // actions
  setEvent: (id: string, name: string) => void;
  setMyPlayerId: (id: string) => void;
  setRoundInfo: (round: number, endsAt: number | undefined) => void;
  setPairings: (p: Pairing[]) => void;
  setMyTableFromPairings: () => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | undefined) => void;
};

export const useEventStore = create<EventState>()((set, get) => ({
  currentEventId: undefined,
  currentEventName: undefined,
  roundNumber: 0,
  roundEndsAt: undefined,
  pairings: [],
  myPlayerId: undefined,
  myTable: undefined,
  isLoading: false,
  error: undefined,
  setEvent: (id: string, name: string) =>
    set({ currentEventId: id, currentEventName: name }),
  setMyPlayerId: (id: string) => set({ myPlayerId: id }),
  setRoundInfo: (round: number, endsAt?: number) =>
    set({ roundNumber: round, roundEndsAt: endsAt }),
  setPairings: (p: Pairing[]) => set({ pairings: p }),
  setMyTableFromPairings: () => {
    const { pairings, myPlayerId } = get();
    if (!myPlayerId) return;
    const mine = pairings.find(
      (x: { playerA: { id: string }; playerB: { id: string } }) =>
        x.playerA.id === myPlayerId || x.playerB.id === myPlayerId,
    );
    if (mine) set({ myTable: mine.tableNumber });
  },
  setLoading: (v: boolean) => set({ isLoading: v }),
  setError: (e?: string) => set({ error: e }),
}));
