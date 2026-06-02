import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { toast } from 'sonner-native';

import { useTheme } from '@/hooks/use-theme';
import { AuthModal } from '@/presentation/components/auth/AuthModal';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';
import { ThemedText } from '@/presentation/components/ThemedText';
import { ThemedView } from '@/presentation/components/ThemedView';

import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useSecurityStore } from '@/stores/security/useSecurityStore';
import { useRegisterDevice } from '@/presentation/hooks/useRegisterDevice';
import { getUniqueDeviceId } from '@/infrastructure/security/deviceSecurity';

const HomeScreen = () => {
  const { user, revalidatePassword } = useAuthStore();
  const { allowPasswordFallback, logAccessAttempt } = useSecurityStore();
  const { handleBiometricAuth } = useRegisterDevice();

  const textColor = useTheme({}, 'text');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hours = new Date().getHours();
  const labelBienvenida =
    hours < 6
      ? 'Buenas noches'
      : hours < 12
        ? 'Buenos días'
        : hours < 18
          ? 'Buenas tardes'
          : 'Buenas noches';

  const handleSubmit = async () => {
    if (!password.trim()) {
      toast.error('Contraseña obligatoria', {
        description: 'Por favor, Ingrese su contraseña',
      });
      return;
    }

    if (password.trim().length < 6) {
      toast.error('Contraseña inválida', {
        description: 'La contraseña tiene que tener más de 5 caracteres',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { ok, message } = await revalidatePassword(password);
      const deviceId = await getUniqueDeviceId();

      if (!ok) {
        await logAccessAttempt(deviceId, 'DENEGADO', 'PASSWORD');
        toast.error('Acceso Denegado', {
          description: message || 'Credenciales inválidas',
        });
        return;
      }

      await logAccessAttempt(deviceId, 'PERMITIDO', 'PASSWORD');
      toast.success('Acceso Autorizado', {
        description: 'Ingreso manual registrado correctamente.',
      });

      setIsModalVisible(false);
      setPassword('');
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado', { description: 'Inténtalo de nuevo' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => null,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/options')}>
              <Ionicons
                color={textColor}
                name="person-circle-outline"
                size={32}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ThemedView className="flex-1 gap-10">
        <ThemedView className="bg-surface items-center justify-center rounded-3xl pt-10">
          <View>
            <TechLogisticsImagotipo height={200} width={270} />
          </View>
        </ThemedView>

        <ThemedView margin className="flex-none items-center gap-5">
          <ThemedText className="text-center text-3xl font-bold">{`${labelBienvenida}, ${user?.nombre}`}</ThemedText>
          <ThemedText
            className="text-center text-sm dark:text-white/35"
            type="normal"
          >
            Ingrese la huella digital asociada al dispositivo para poder
            ingresar al almacén
          </ThemedText>
        </ThemedView>

        <View className="items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleBiometricAuth()}
          >
            <Ionicons className="color-text" name="finger-print" size={300} />
          </TouchableOpacity>

          {allowPasswordFallback && (
            <ThemedText
              className="mt-5"
              type="link"
              onPress={() => setIsModalVisible(true)}
            >
              ¿Este dispositivo no cuenta con huella?
            </ThemedText>
          )}
        </View>

        <AuthModal
          description="Ingrese su contraseña para registrar el acceso al almacén"
          isSubmitting={isSubmitting}
          passwordValue={password}
          title="Ingreso al almacén"
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          onPasswordChange={(value) => setPassword(value)}
          onPress={handleSubmit}
        />
      </ThemedView>
    </>
  );
};

export default HomeScreen;
