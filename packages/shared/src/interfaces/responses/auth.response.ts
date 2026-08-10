import type {UserData} from "./get-user-response";
import type {ErrorsDetails} from "./error-details";

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