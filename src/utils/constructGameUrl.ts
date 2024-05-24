import { Game } from '@/types';

export const constructGameUrl = (persistedGame: Game | null, game: Game) => {
  const currentGame = persistedGame || game;
  if (!currentGame || !currentGame.url) {
    return '';
  }
  return currentGame.port
    ? `${currentGame.url}:${currentGame.port}`
    : currentGame.url;
};
