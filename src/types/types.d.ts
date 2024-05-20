export interface Game {
  id: number;
  title: string;
  url: string;
  port?: number;
}

export interface JoinGameHandler {
  isStarted: boolean;
  game: Game;
}

export interface VerifyCodeHandler {
  success: boolean;
  error?: string;
}
