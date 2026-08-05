import type { Socket } from 'socket.io-client';

import { registerSecurityListeners } from './listeners/security.listeners';

export function registerSocketListeners(socket: Socket) {
  registerSecurityListeners(socket);
}
