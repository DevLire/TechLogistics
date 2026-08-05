import { create } from 'zustand';
import { useAuthStore } from '../auth/useAuthStore';

import { registerDeviceAction } from '@/core/actions/security/register-device.action';
import { logAccesoAction } from '@/core/actions/security/log-acceso.action';

import type { SecurityFlags } from '@/infrastructure/interfaces/responses/security.interface';

type SecurityState = {
  // Properties
  isDeviceRegistered: boolean;
  canRegisterDevice: boolean;
  allowPasswordFallback: boolean;
  isCheckingSecurity: boolean;

  // Actions
  setSecurityFlags: (flags: SecurityFlags) => void;
  registerDevice: (deviceId: string, deviceName: string) => Promise<boolean>;
  logAccessAttempt: (
    deviceId: string,
    estado: 'PERMITIDO' | 'DENEGADO',
    metodo: 'HUELLA' | 'PASSWORD'
  ) => Promise<boolean>;
  resetSecurity: () => void;
  setCanRegisterDevice: (canRegisterDevice: boolean) => void;
  setIsDeviceRegistered: (isDeviceRegistered: boolean) => void;
};

export const useSecurityStore = create<SecurityState>()((set, get) => ({
  isDeviceRegistered: false,
  canRegisterDevice: false,
  allowPasswordFallback: false,
  isCheckingSecurity: true,

  setSecurityFlags: (flags: SecurityFlags) => {
    set({
      isDeviceRegistered: flags.isDeviceRegistered,
      canRegisterDevice: flags.canRegisterDevice,
      allowPasswordFallback: flags.allowPasswordFallback,
      isCheckingSecurity: false,
    });
  },

  setCanRegisterDevice: (canRegisterDevice: boolean) => {
    set({
      canRegisterDevice,
    });
  },

  setIsDeviceRegistered: (isDeviceRegistered) => {
    set({
      isDeviceRegistered: isDeviceRegistered,
    });
  },

  // Registra el dispositivo físico vinculándolo con el usuario autenticado actual
  registerDevice: async (deviceId: string, deviceName: string) => {
    try {
      set({ isCheckingSecurity: true });

      // Obtenemos el id del usuario directamente del otro store de Zustand de manera limpia
      const userId = useAuthStore.getState().user?.id_usuario;
      if (!userId) return false;

      await registerDeviceAction(userId, deviceId, deviceName);

      // Si el backend responde exitosamente, actualizamos el estado local instantáneamente
      set({
        isDeviceRegistered: true,
        canRegisterDevice: false,
      });
      return true;
    } catch (error) {
      console.error('Error al registrar dispositivo en el store:', error);
      return false;
    } finally {
      set({ isCheckingSecurity: false });
    }
  },

  // Envía el rastro de auditoría al backend (sea exitoso o fallido)
  logAccessAttempt: async (
    deviceId: string,
    estado: 'PERMITIDO' | 'DENEGADO',
    metodo: 'HUELLA' | 'PASSWORD'
  ) => {
    try {
      const userId = useAuthStore.getState().user?.id_usuario;
      if (!userId) return false;

      await logAccesoAction(userId, deviceId, estado, metodo);
      return true;
    } catch (error) {
      console.error('Error al registrar log de acceso:', error);
      return false;
    }
  },

  //Limpia el estado de seguridad al hacer logout de la app
  resetSecurity: () => {
    set({
      isDeviceRegistered: false,
      canRegisterDevice: false,
      allowPasswordFallback: false,
      isCheckingSecurity: false,
    });
  },
}));
