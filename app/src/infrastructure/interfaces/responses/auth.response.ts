import type { ErrorsDetails } from '@/infrastructure/interfaces/error-details.interfaces';
import type { UserData } from './get-user.response.ts';

export interface AuthResponse {
  status:   string;
  user:     UserData;
  token:    string;
  security: Security;
  errors:   ErrorsDetails[];
}

export interface Security {
  isDeviceRegistered:    boolean;
  canRegisterDevice:     boolean;
  allowPasswordFallback: boolean;
}