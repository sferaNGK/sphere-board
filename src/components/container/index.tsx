import React, { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={clsx('container max-w-7xl', className)}>{children}</div>
  );
};
