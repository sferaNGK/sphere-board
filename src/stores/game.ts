import { create } from 'zustand';
import { Game } from '@/types';
import { persist } from 'zustand/middleware';

interface GameStore {
  game: Game | null;
  teamName: string | null;
  isStarted: boolean;
  setPersistedGame: (game: Game | null) => void;
  getPersistedGame: () => Game | null;
  setIsStarted: (isStarted: boolean) => void;
  setTeamName: (teamName: string) => void;
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,
      isStarted: false,
      teamName: null,
      setPersistedGame: (game: Game | null) => set({ game }),
      getPersistedGame: () => get().game,
      setIsStarted: (isStarted: boolean) => set({ isStarted }),
      setTeamName: (teamName: string) => set({ teamName }),
    }),
    {
      name: 'game-storage',
    },
  ),
);
