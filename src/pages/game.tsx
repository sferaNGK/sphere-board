import {
  Card,
  CardDescription,
  CardHeader,
  Container,
  IframeGame,
  Typography,
} from '@/components';
import { useEffect, useState } from 'react';
import { useGame, useSocket } from '@/stores';
import { Game, JoinGameHandler } from '@/types';

export const GameScreen = () => {
  const [socket, getClientId] = useSocket((state) => [
    state.socket,
    state.getClientId,
  ]);
  const [isStarted, setIsStarted] = useState(false);
  const [persistedGame, setPersistedGame] = useGame((state) => [
    state.game,
    state.setPersistedGame,
  ]);
  const [game, setGame] = useState({} as Game);

  useEffect(() => {
    if (socket) {
      const clientId = getClientId();
      socket.emit('game:join', { clientId });

      socket.on('game:start', ({ isStarted, game }: JoinGameHandler) => {
        game && setGame({ ...game });
        setPersistedGame({ ...game });
        isStarted && setIsStarted(isStarted);
      });

      return () => {
        socket.off('game:start');
      };
    }
  }, [socket, getClientId]);

  return (
    <div>
      {isStarted || persistedGame ? (
        <IframeGame
          gameSrc={
            persistedGame?.port
              ? `${persistedGame.url}:${persistedGame.port}`
              : persistedGame?.url
                ? `${game.url}:${game.port}`
                : game.url
          }
        />
      ) : (
        <Container>
          <Card>
            <CardHeader>
              <Typography
                variant="title"
                tag="h1"
                className="text-4xl font-bold mb-5 max-lg:text-center">
                Ожидайте начала игры...
              </Typography>
              <CardDescription>
                Подождите, пока администратор запустит игру.
              </CardDescription>
            </CardHeader>
          </Card>
        </Container>
      )}
    </div>
  );
};
