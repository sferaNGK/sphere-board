import { create } from 'zustand';
import { Game } from '@/types';
import { persist } from 'zustand/middleware';

interface GameStore {
  game: Game | null;
  isVR: boolean;
  isStarted: boolean;
  setPersistedGame: (game: Game | null) => void;
  getPersistedGame: () => Game | null;
  setIsStarted: (isStarted: boolean) => void;
  setIsVR: (isVR: boolean) => void;
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,
      isVR: false,
      isStarted: false,
      setPersistedGame: (game: Game | null) => set({ game }),
      getPersistedGame: () => get().game,
      setIsStarted: (isStarted: boolean) => set({ isStarted }),
      setIsVR: (isVR: boolean) => set({ isVR }),
    }),
    {
      name: 'game-storage',
    },
  ),
);
