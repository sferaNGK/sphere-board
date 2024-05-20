import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  callbackCondition: () => boolean;
  redirectPath: string;
  invertCondition?: boolean;
}

export const ProtectedRoute = ({
  children,
  callbackCondition,
  redirectPath,
  invertCondition = false,
}: ProtectedRouteProps) => {
  const callbackResult = callbackCondition();

  if (invertCondition ? !callbackResult : callbackResult) {
    return <Navigate to={redirectPath} />;
  }

  return children;
};
