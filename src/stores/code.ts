import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CodeStore {
  code: string | null;
  isVerified: boolean;
  setCode: (code: string) => void;
  checkCode: () => boolean;
  setIsVerified: () => void;
}

export const useCode = create<CodeStore>()(
  persist(
    (set, get) => ({
      code: null,
      isVerified: false,
      setCode: (code: string) => set({ code: code }),
      checkCode: () => !!get().code,
      setIsVerified: () => set({ isVerified: true }),
    }),
    {
      name: 'code-storage',
    },
  ),
);
