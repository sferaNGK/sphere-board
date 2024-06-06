import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CodeForm,
  Typography,
} from '@/components';
import { useCode, useGame, useSocket } from '@/stores';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, VerifyCodeHandler } from '@/types';

export const CodeActivation = () => {
  const [socket, setClientId, reconnect] = useSocket((state) => [
    state.socket,
    state.setClientId,
    state.reconnect,
  ]);
  const setIsVerified = useCode((state) => state.setIsVerified);
  const [setPersistedIsStarted, setPersistedGame] = useGame((state) => [
    state.setIsStarted,
    state.setPersistedGame,
  ]);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();

  // TODO: можно зарефакторить??

  useEffect(() => {
    if (socket) {
      socket.on(
        'user:verifyCode',
        ({ success, error, game, isSessionStarted }: VerifyCodeHandler) => {
          if (!success) {
            error && setError(error);
            return;
          }

          if (game) {
            setPersistedGame(game);
          }

          if (isSessionStarted) {
            setPersistedIsStarted(isSessionStarted);
          }

          navigate('/game');
          setClientId();
          setIsVerified();

          reconnect();
        },
      );

      socket.on(
        'game:endGameSession',
        ({ isCompleted, users }: { isCompleted: boolean; users: User[] }) => {
          if (isCompleted) {
            localStorage.clear();
            reconnect();
            navigate('/end', { state: { users } });
          }
        },
      );
    }

    return () => {
      socket?.off('user:verifyCode');
      socket?.off('game:waiting');
      socket?.off('game:endGameSession');
    };
  }, [socket]);

  return (
    <>
      <div className="container max-w-7xl flex justify-center items-center flex-col">
        <Card>
          <CardHeader>
            <Typography
              variant="title"
              tag="h1"
              className="text-4xl font-bold mb-5 max-lg:text-center">
              Введите код активации
            </Typography>
            <CardDescription className="max-lg:text-center">
              Введите код с вашего мобильного телефона
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CodeForm error={error} setError={setError} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
