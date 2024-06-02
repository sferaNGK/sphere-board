import { create } from 'zustand';
import { Game } from '@/types';
import { persist } from 'zustand/middleware';

interface GameStore {
  game: Game | null;
  isStarted: boolean;
  setPersistedGame: (game: Game | null) => void;
  getPersistedGame: () => Game | null;
  setIsStarted: (isStarted: boolean) => void;
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,
      isStarted: false,
      setPersistedGame: (game: Game | null) => set({ game }),
      getPersistedGame: () => get().game,
      setIsStarted: (isStarted: boolean) => set({ isStarted }),
    }),
    {
      name: 'game-storage',
    },
  ),
);
