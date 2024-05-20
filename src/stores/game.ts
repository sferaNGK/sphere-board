import { create } from 'zustand';
import { Game } from '@/types';
import { persist } from 'zustand/middleware';

interface GameStore {
  game: Game | null;
  setPersistedGame: (game: Game) => void;
  getPersistedGame: () => Game | null;
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,
      setPersistedGame: (game: Game) => set({ game }),
      getPersistedGame: () => get().game,
    }),
    {
      name: 'game-storage',
    },
  ),
);
