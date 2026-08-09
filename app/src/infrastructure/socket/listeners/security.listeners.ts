import type { Socket } from 'socket.io-client';

import { SocketEvents } from '@/infrastructure/socket/events/socket-event';
import { useSecurityStore } from '@/stores/security/use-security-store';
import { useAuthStore } from '@/stores/auth/use-auth-store';
import type {
  PasswordFallbackPermissionPayload,
  RegistrationPermissionPayload,
} from '@/infrastructure/socket/events/security.payloads';

export function registerSecurityListeners(socket: Socket) {
  socket.on(
    SocketEvents.RegistrationPermissionUpdated,
    ({ canRegisterDevice }: RegistrationPermissionPayload) => {
      useSecurityStore.getState().setCanRegisterDevice(canRegisterDevice);
    }
  );

  socket.on(SocketEvents.UserDisabled, () => {
    useAuthStore.getState().logout();
  });

  socket.on(SocketEvents.DeviceRevoked, () => {
    useSecurityStore.getState().setIsDeviceRegistered(false);
  });

  socket.on(
    SocketEvents.PasswordFallbackPermissionUpdated,
    ({ allowPasswordFallback }: PasswordFallbackPermissionPayload) => {
      useSecurityStore
        .getState()
        .setAllowPasswordFallback(allowPasswordFallback);
    }
  );
}
