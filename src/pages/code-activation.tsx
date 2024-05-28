import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CodeForm,
  Typography,
} from '@/components';
import { useCode, useGame, useSocket } from '@/stores';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerifyCodeHandler } from '@/types';

export const CodeActivation = () => {
  const [socket, setClientId, reconnect] = useSocket((state) => [
    state.socket,
    state.setClientId,
    state.reconnect,
  ]);
  const setIsVerified = useCode((state) => state.setIsVerified);
  const [setPersistedIsStarted, setPersistedGame, setPersistedTeamName] =
    useGame((state) => [
      state.setIsStarted,
      state.setPersistedGame,
      state.setTeamName,
    ]);
  const [error, setError] = React.useState<string | undefined>();
  const [isWaitingForEnd, setIsWaitingForEnd] = useState(false);
  const navigate = useNavigate();

  // TODO: можно зарефакторить??

  React.useEffect(() => {
    socket?.on(
      'user:verifyCode',
      ({
        success,
        error,
        game,
        isSessionStarted,
        teamName,
      }: VerifyCodeHandler) => {
        if (!success) {
          error && setError(error);
          return;
        }

        if (game && teamName) {
          setPersistedGame(game);
          setPersistedTeamName(teamName);
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

    socket?.on('game:waiting', ({ isWaiting }: { isWaiting: boolean }) => {
      if (isWaiting) {
        setIsWaitingForEnd(isWaiting);
      }
    });

    return () => {
      socket?.off('user:verifyCode');
      socket?.off('user:waiting');
    };
  }, [socket]);

  return (
    <>
      {!isWaitingForEnd ? (
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
      ) : (
        <Typography
          variant="title"
          tag="h1"
          className="text-7xl font-bold mb-5 text-center">
          Ожидаем других игроков.
        </Typography>
      )}
    </>
  );
};
