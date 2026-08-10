export const SecuritySocketEvents = {
  RegistrationPermissionUpdated: 'security:registration-permission-updated',

  UserDisabled: 'security:user-disabled',

  DeviceRevoked: 'security:device-revoked',

  PasswordFallbackPermissionUpdated:
    'security:password-fallback-permisison-updated',
} as const;