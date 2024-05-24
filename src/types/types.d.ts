export interface Game {
  id: number;
  title: string;
  url: string;
  port?: number;
}

export interface ToggleGameHandler {
  isStarted: boolean;
  game: Game;
}

export interface VerifyCodeHandler {
  success: boolean;
  error?: string;
}
