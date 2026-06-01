import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Obtener el ID físico del dispositivo
export const getUniqueDeviceId = async (): Promise<string> => {
  if (Platform.OS === 'android') {
    return Application.getAndroidId();
  } else {
    const iosId = await Application.getIosIdForVendorAsync();
    if (!iosId) {
      throw new Error(
        'No se pudo obtener el identificador de proveedor de iOS.'
      );
    }
    return iosId;
  }
};

// Guardar el token de enlace en el chip seguro
export const loggerDeviceLocally = async (userId: string) => {
  const deviceId = await getUniqueDeviceId();
  const payload = JSON.stringify({ userId, deviceId });

  await SecureStore.setItemAsync('tl_security_token', payload, {
    requireAuthentication: true,
    authenticationPrompt:
      'Confirma tu huella para enlazar este dispositivo a tu cuenta',
  });
};

// Validar la huella local y recuperar los datos enlazados
export const verifyLocalFingerprint = async (): Promise<{
  userId: string;
  deviceId: string;
} | null> => {
  try {
    const session = await SecureStore.getItemAsync('tl_security_token', {
      authenticationPrompt: 'Coloca tu huella para acceder',
    });

    if (!session) return null;
    return JSON.parse(session);
  } catch (error) {
    console.log('Autenticación biométrica fallida o cancelada', error);
    return null;
  }
};
