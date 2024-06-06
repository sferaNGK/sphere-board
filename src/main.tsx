import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components';

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>,
);
