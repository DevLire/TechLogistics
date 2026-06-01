import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import * as Device from 'expo-device';

import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useSecurityStore } from '@/stores/security/useSecurityStore';
import {
  loggerDeviceLocally,
  verifyLocalFingerprint,
  getUniqueDeviceId,
} from '@/infrastructure/security/deviceSecurity';

export const useRegisterDevice = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    isDeviceRegistered,
    canRegisterDevice,
    registerDevice,
    logAccessAttempt,
  } = useSecurityStore();

  const handleBiometricAuth = async () => {
    if (!user?.id_usuario) return;

    const deviceId = await getUniqueDeviceId();

    // CASO 1: El dispositivo ya está vinculado
    if (isDeviceRegistered) {
      const biometriaValida = await verifyLocalFingerprint();

      if (
        biometriaValida &&
        Number(biometriaValida.userId) === user.id_usuario
      ) {
        await logAccessAttempt(deviceId, 'PERMITIDO', 'HUELLA');

        toast.success('Acceso Autorizado', {
          description: 'Se ha enviado la orden de apertura a la cerradura.',
        });
      } else {
        await logAccessAttempt(deviceId, 'DENEGADO', 'HUELLA');

        toast.error('Acceso Denegado', {
          description: 'La huella no coincide o fue cancelada.',
        });
      }
      return;
    }

    // CASO 2: Dispositivo nuevo, operario con permiso
    if (!isDeviceRegistered && canRegisterDevice) {
      try {
        await loggerDeviceLocally(String(user.id_usuario));

        const deviceName = Device.modelName || 'Terminal Móvil';
        const enrolamientoExitoso = await registerDevice(deviceId, deviceName);

        if (enrolamientoExitoso) {
          toast.success('Dispositivo Enlazado', {
            description: 'Terminal registrado con éxito. Ya puedes operar.',
          });
          // 🌟 ¡Redirigimos a la pantalla principal!
          router.replace('/home');
        } else {
          toast.error('Error de Servidor', {
            description: 'El backend rechazó el registro.',
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Error de Enrolamiento', {
          description: 'Proceso biométrico cancelado.',
        });
      }
      return;
    }
  };

  return {
    handleBiometricAuth,
  };
};
