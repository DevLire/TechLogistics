import type { Socket } from 'socket.io-client';

import { useSecurityStore } from '@/stores/security/use-security-store';
import { useAuthStore } from '@/stores/auth/use-auth-store';
import type {
  PasswordFallbackPermissionPayload,
  RegistrationPermissionPayload,
} from '@techlogistics/shared/realtime/security';
import { SecuritySocketEvents } from '@techlogistics/shared/realtime/security';

export function registerSecurityListeners(socket: Socket) {
  socket.on(
    SecuritySocketEvents.RegistrationPermissionUpdated,
    ({ canRegisterDevice }: RegistrationPermissionPayload) => {
      useSecurityStore.getState().setCanRegisterDevice(canRegisterDevice);
    }
  );

  socket.on(SecuritySocketEvents.UserDisabled, () => {
    useAuthStore.getState().logout();
  });

  socket.on(SecuritySocketEvents.DeviceRevoked, () => {
    useSecurityStore.getState().setIsDeviceRegistered(false);
  });

  socket.on(
    SecuritySocketEvents.PasswordFallbackPermissionUpdated,
    ({ allowPasswordFallback }: PasswordFallbackPermissionPayload) => {
      useSecurityStore
        .getState()
        .setAllowPasswordFallback(allowPasswordFallback);
    }
  );
}
