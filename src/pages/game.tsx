import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  Container,
  IframeGame,
  Typography,
} from '@/components';
import { useEffect, useState } from 'react';
import { useCode, useGame, useSocket } from '@/stores';
import { Game, MessageEventData, ToggleGameHandler, User } from '@/types';
import { constructGameUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export const GameScreen = () => {
  const [socket, getClientId, reconnect] = useSocket((state) => [
    state.socket,
    state.getClientId,
    state.reconnect,
  ]);
  const [isStarted, setIsStarted] = useState(false);
  const [persistedGame, setPersistedGame, isPersistStarted, setPersistStarted] =
    useGame((state) => [
      state.game,
      state.setPersistedGame,
      state.isStarted,
      state.setIsStarted,
    ]);
  const setIsVerifiedToFalse = useCode((state) => state.setIsVerifiedToFalse);
  const [game, setGame] = useState({} as Game);
  const navigate = useNavigate();

  const endGame = () => {
    if (socket) {
      socket.emit('game:end', { game: persistedGame, points: 1000 });
    }
  };

  window.addEventListener(
    'message',
    function (ev: MessageEvent<MessageEventData>) {
      const { points } = ev.data;
      if (game && points) {
        socket?.emit('game:end', { game: persistedGame, points });
      }
    },
  );

  useEffect(() => {
    if (socket) {
      const clientId = getClientId();
      socket.emit('game:join', { clientId });

      socket.on('game:start', ({ isStarted, game }: ToggleGameHandler) => {
        game && setGame({ ...game });
        setPersistedGame({ ...game });
        if (isStarted) {
          setIsStarted(isStarted);
          setPersistStarted(isStarted);
        }
      });

      socket.on('game:end', ({ isStarted }: ToggleGameHandler) => {
        if (!isStarted) {
          setIsStarted(isStarted);
          setPersistStarted(false);
          setGame({} as Game);
          setIsVerifiedToFalse();
          localStorage.removeItem('clientId');
          reconnect();
          navigate('/');
        }
      });

      socket.on(
        'game:endGameSession',
        ({ isCompleted, users }: { isCompleted: boolean; users: User[] }) => {
          if (isCompleted) {
            setIsStarted(!isCompleted);
            localStorage.clear();
            reconnect();
            navigate('/end', { state: { users } });
          }
        },
      );

      return () => {
        socket.off('game:join');
        socket.off('game:start');
        socket.off('game:end');
        socket.off('game:endGameSession');
      };
    }
  }, [socket]);

  return (
    <div>
      {isStarted || isPersistStarted ? (
        <IframeGame gameSrc={constructGameUrl(persistedGame, game)} />
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
      {isStarted || isPersistStarted ? (
        <Button
          variant="default"
          className="fixed bottom-4 right-4"
          onClick={endGame}>
          Закончить игру
        </Button>
      ) : null}
    </div>
  );
};
