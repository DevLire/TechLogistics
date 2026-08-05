import type { Socket } from 'socket.io-client';

import { SocketEvents } from '@/infrastructure/socket/events/socket-event';
import { useSecurityStore } from '@/stores/security/useSecurityStore';
import type { RegistrationPermissionPayload } from '@/infrastructure/socket/events/security.payloads';

export function registerSecurityListeners(socket: Socket) {
  socket.on(
    SocketEvents.RegistrationPermissionUpdated,
    ({ canRegisterDevice }: RegistrationPermissionPayload) => {
      useSecurityStore.getState().setCanRegisterDevice(canRegisterDevice);
    }
  );
}
