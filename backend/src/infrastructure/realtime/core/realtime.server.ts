import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { SocketAuthMiddleware } from '../middleware/socket-auth.middleware';
import { AuthenticatedSocket } from '../types/authenticated-socket';

export class RealtimeServer {
  private readonly io: SocketIOServer;
  private static instance: RealtimeServer;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGIN,
        credentials: true,
      },
    });

    RealtimeServer.instance = this;
  }

  public static getInstance(): RealtimeServer {
    return RealtimeServer.instance;
  }

  public initialize() {
    this.io.use(SocketAuthMiddleware.authenticate);

    this.io.on('connection', (socket) => {
      const authSocket = socket as AuthenticatedSocket;

      if (!authSocket.identity) {
        socket.disconnect(true);
        return;
      }

      const userRoom = this.getUserRoom(authSocket.identity.userId);

      authSocket.join(userRoom);

      console.log(`Client connected: ${authSocket.id}`);
      console.log(`User ${authSocket.identity.userId} joined room ${userRoom}`);

      authSocket.on('disconnect', () => {
        console.log(`User ${authSocket.identity.userId} disconnected`);
      });
    });
  }

  public emitToUser(userId: number, event: string, payload: unknown): void {
    this.io.to(this.getUserRoom(userId)).emit(event, payload);
  }

  public emitToDevice(deviceId: string, event: string, payload: unknown): void {
    this.io.to(this.getDeviceRoom(deviceId)).emit(event, payload);
  }

  private getUserRoom(userId: number): string {
    return `user:${userId}`;
  }

  private getDeviceRoom(deviceId: string): string {
    return `device:${deviceId}`;
  }
}
