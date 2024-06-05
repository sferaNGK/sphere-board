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
  const [
    persistedGame,
    setPersistedGame,
    isPersistStarted,
    setPersistStarted,
    isVR,
    setIsVR,
  ] = useGame((state) => [
    state.game,
    state.setPersistedGame,
    state.isStarted,
    state.setIsStarted,
    state.isVR,
    state.setIsVR,
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
      socket?.emit('game:end', { game: persistedGame, points });
    },
  );

  const clearLocalStorage = () => {
    setIsStarted(isStarted);
    setPersistStarted(false);
    setPersistedGame(null);
    setGame({} as Game);
    setIsVerifiedToFalse();
    setIsVR(false);
    localStorage.removeItem('clientId');
  };

  useEffect(() => {
    if (socket) {
      const clientId = getClientId();
      socket.emit('game:join', { clientId });

      socket.on('game:start', ({ isStarted, game }: ToggleGameHandler) => {
        if (game.url === 'VR') {
          setIsVR(true);
        }
        game && setGame({ ...game });
        setPersistedGame({ ...game });
        if (isStarted) {
          setIsStarted(isStarted);
          setPersistStarted(isStarted);
        }
      });

      socket.on(
        'game:end',
        ({ isStarted, clientIdBoard }: ToggleGameHandler) => {
          if (clientIdBoard === clientId && !isStarted) {
            clearLocalStorage();
            reconnect();
            navigate('/');
            return;
          }
          if (!isStarted) {
            clearLocalStorage();
            reconnect();
            navigate('/');
          }
        },
      );

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
        socket.off('game:start');
        socket.off('game:end');
        socket.off('game:endGameSession');
      };
    }
  }, [socket]);

  return (
    <>
      {isStarted || isPersistStarted ? (
        !isVR ? (
          <IframeGame gameSrc={constructGameUrl(persistedGame, game)} />
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-3xl font-bold">
              Попросите включить Вам {game.title}
            </span>
          </div>
        )
      ) : (
        <Container>
          <Card>
            <CardHeader>
              <Typography
                variant="title"
                tag="h1"
                className="text-4xl font-bold mb-5 max-lg:text-center">
                Ожидайте начала игры...
                {isVR}
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
    </>
  );
};
