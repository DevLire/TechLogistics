import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { SocketAuthMiddleware } from '../middleware/socket-auth.middleware';
import { AuthenticatedSocket } from '../types/authenticated-socket';

export class RealtimeServer {
  private readonly io: SocketIOServer;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGIN,
        credentials: true,
      },
    });
  }

  public initialize() {
    this.io.use(SocketAuthMiddleware.authenticate);

    this.io.on('connection', (socket) => {
      const authSocket = socket as AuthenticatedSocket;

      console.log(`Client connected: ${authSocket.id}`);

      const userRoom = `user:${authSocket.identity.userId}`;
      authSocket.join(userRoom);

      console.log(`User ${authSocket.identity.userId} joined ${userRoom}`);

      authSocket.on('disconnect', () => {
        console.log(`User ${authSocket.identity.userId} disconnected`);
      });
    });
  }
}
