import styles from './iframe.module.css';
import { clsx } from 'clsx';

interface IframeGameProps {
  className?: string;
  gameSrc: string;
}

export const IframeGame = ({ className, gameSrc }: IframeGameProps) => {
  return <iframe className={clsx(styles['iframe'], className)} src={gameSrc} />;
};
