import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketStore {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  setClientId: () => void;
  getClientId: () => string | null;
}

export const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    const socket = io(`${import.meta.env.VITE_WEBSOCKET_URL}`, {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      set({ socket, isConnected: true });
    });
    socket.on('disconnect', () => {
      set({ socket: null, isConnected: false });
    });
  },
  disconnect: () => {
    if (get().socket) {
      get().socket?.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
  setClientId: () => {
    if (get()?.socket) {
      localStorage.setItem('clientId', get()?.socket?.id as string);
    }
  },
  getClientId: () => {
    return localStorage.getItem('clientId');
  },
}));
