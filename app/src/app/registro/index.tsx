import { useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { toast } from 'sonner-native';

import { ThemedView } from '@/presentation/components/theme/ThemedView';
import { ThemedText } from '@/presentation/components/theme/ThemedText';
import { ThemedButton } from '@/presentation/components/theme/ThemedButton';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';
import { AuthModal } from '@/presentation/components/auth/AuthModal';

import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useSecurityStore } from '@/stores/security/useSecurityStore';
import { useRegisterDevice } from '@/presentation/hooks/useRegisterDevice';

const RegistroScreen = () => {
  const { user, logout, revalidatePassword } = useAuthStore();
  const { allowPasswordFallback } = useSecurityStore();

  const { handleBiometricAuth, handlePasswordRegistration } =
    useRegisterDevice();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss();
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

      if (!ok) {
        toast.error('Acceso Denegado', {
          description: message || 'Credenciales inválidas',
        });
        return;
      }

      await handlePasswordRegistration();

      setIsModalVisible(false);
      setPassword('');
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado', {
        description: 'Inténtalo de nuevo al registrar el dispositivo',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView className="flex-1">
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado e Imagotipo */}
        <ThemedView className="bg-surface pt- items-center justify-center rounded-b-3xl py-8 shadow-sm">
          <TechLogisticsImagotipo height={150} width={220} />
        </ThemedView>

        {/* Textos Informativos */}
        <View className="mt-4 items-center gap-4 px-6">
          <ThemedText className="text-center text-3xl font-bold" type="h1">
            Enrolar Dispositivo
          </ThemedText>
          <ThemedText
            className="text-center text-sm dark:text-white/35"
            type="normal"
          >
            Hola <ThemedText type="semi-bold">{user?.nombre}</ThemedText>,
            tienes autorización para registrar este terminal. Asigna un nombre e
            ingresa tu huella física para guardarlo.
          </ThemedText>
        </View>

        {/* Sensor de Huella y Enlace de Contraseña */}
        <View className="mt-10 mb-8 flex-1 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleBiometricAuth()}
          >
            <Ionicons className="color-text" name="finger-print" size={260} />
          </TouchableOpacity>

          <ThemedText className="mt-4 text-sm dark:text-white/40" type="normal">
            Toca el icono para escanear biometría
          </ThemedText>

          {/* Condicional para mostrar la opción de registrar por contraseña */}
          {allowPasswordFallback && (
            <ThemedText
              className="mt-6"
              type="link"
              onPress={() => setIsModalVisible(true)}
            >
              ¿Registrar usando contraseña?
            </ThemedText>
          )}
        </View>

        {/* Botón de salida */}
        <View className="mt-auto mb-8 px-6">
          <ThemedButton className="border-outline border" onPress={logout}>
            Cancelar y cerrar sesión
          </ThemedButton>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal de Autenticación */}
      <AuthModal
        description="Ingrese su contraseña para autorizar el registro de este terminal"
        isSubmitting={isSubmitting}
        passwordValue={password}
        title="Registrar Dispositivo"
        visible={isModalVisible && allowPasswordFallback}
        onDismiss={() => setIsModalVisible(false)}
        onPasswordChange={(value) => setPassword(value)}
        onPress={handleSubmit}
      />
    </ThemedView>
  );
};

export default RegistroScreen;
