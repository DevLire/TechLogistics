import { Socket } from 'socket.io';

export interface SocketIdentity {
  userId: number;
  deviceId: string;
  role: string;
}

export interface AuthenticatedSocket extends Socket {
  identity: SocketIdentity;
}
