import { Socket } from 'socket.io';

export interface SocketIdentity {
  userId: number;
  deviceId?: number;
  role: string;
}

export interface AuthenticatedSocket extends Socket {
  identity: SocketIdentity;
}
