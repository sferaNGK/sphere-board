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
  teamName: string;
}

export interface MessageEventData {
  teamName: string;
  points: number;
}
