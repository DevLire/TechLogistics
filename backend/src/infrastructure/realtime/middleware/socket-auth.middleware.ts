import { Socket } from 'socket.io';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { prisma } from '../../../data/posgres';
import { AuthenticatedSocket } from '../types/authenticated-socket';

export class SocketAuthMiddleware {
  static async authenticate(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = await JwtAdapter.validateToken<{ id: number }>(token);

    if (!payload) {
      return next(new Error('Invalid token'));
    }

    const user = await prisma.usuario.findUnique({
      where: {
        id_usuario: payload.id,
      },
    });

    if (!user) return next(new Error('User not found'));

    if (!user.activo) return next(new Error('User inactive'));

    (socket as AuthenticatedSocket).identity = {
      userId: user.id_usuario,
      role: user.rol,
    };

    next();
  }
}
