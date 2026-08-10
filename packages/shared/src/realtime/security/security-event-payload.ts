import {SecuritySocketEvents} from './security-events';

import type {
  RegistrationPermissionPayload,
  PasswordFallbackPermissionPayload,
} from './security-payloads';

export interface SecuritySocketEventPayloads {
  [SecuritySocketEvents.UserDisabled]: Record<string, never>;

  [SecuritySocketEvents.RegistrationPermissionUpdated]:
    RegistrationPermissionPayload;

  [SecuritySocketEvents.PasswordFallbackPermissionUpdated]:
    PasswordFallbackPermissionPayload;
}