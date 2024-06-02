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
  success?: boolean;
  game?: Game;
  error?: string;
  isSessionStarted?: boolean;
}

export interface MessageEventData {
  points: number;
}

export interface User {
  id: number;
  teamName: string;
  points: number;
}
