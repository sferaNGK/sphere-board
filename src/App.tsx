import { Route, Routes } from 'react-router-dom';
import { CodeActivation, GameScreen as Game } from '@/pages';
import { ProtectedRoute } from '@/components';
import { useCode, useSocket } from '@/stores';
import { useEffect } from 'react';

export const App = () => {
  const isVerified = useCode((state) => state.isVerified);
  const [connect, disconnect] = useSocket((state) => [
    state.connect,
    state.disconnect,
  ]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute
            callbackCondition={() => isVerified}
            redirectPath={'/game'}>
            <CodeActivation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute
            invertCondition={true}
            callbackCondition={() => isVerified}
            redirectPath={'/'}>
            <Game />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
