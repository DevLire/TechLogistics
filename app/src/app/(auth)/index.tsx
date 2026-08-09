import { useState } from 'react';
import { View, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';

import { router } from 'expo-router';
import { ImageBackground } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';

import { toast } from 'sonner-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ThemedText } from '@/presentation/components/theme/ThemedText';
import { ThemedInput } from '@/presentation/components/theme/ThemedInput';
import { ThemedButton } from '@/presentation/components/theme/ThemedButton';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { regularExps } from '@/config/regular-exp';
import { AppFooter } from '@/presentation/components/AppFooter';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!form.email.trim() || !form.password.trim()) {
      toast.error('Campos obligatorios', {
        description: 'Por favor, llena todos los campos.',
      });
      return;
    }
    if (!regularExps.email.test(form.email)) {
      toast.error('Email inválido', {
        description: 'El email tiene que ser un email válido.',
      });
      return;
    }
    if (form.password.trim().length < 6) {
      toast.error('Contraseña inválida', {
        description: 'La contraseña tiene que tener más de 5 caracteres',
      });
      return;
    }
    try {
      setIsSubmitting(true);

      const response = await login(form.email, form.password);

      if (!response.ok) {
        toast.error('Error al iniciar sesión', {
          description: response.message || 'Credenciales inválidas',
        });
        return;
      }

      router.replace('/');
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado', { description: 'Inténtalo de nuevo' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground
      contentFit="cover"
      source={colorScheme === 'light' ? bgLight : bgDark}
      style={{ flex: 1 }}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        {/* Imagotipo */}
        <View className="my-20 flex items-center">
          <TechLogisticsImagotipo height={200} width={270} />
        </View>

        {/* Bienvenida */}
        <View className="flex items-center">
          <ThemedText type="heading">¡Bienvenido!</ThemedText>
        </View>

        {/* Inputs */}
        <View className="mx-5 mt-20 gap-y-10">
          <ThemedInput
            autoCapitalize="none"
            iconName="mail-outline"
            keyboardType="email-address"
            placeholder="Correo electrónico"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <ThemedInput
            secureTextEntry
            autoCapitalize="none"
            left={
              <TextInput.Icon
                icon={({ size, color }) => (
                  <Ionicons
                    color={color}
                    name="lock-closed-outline"
                    size={size}
                  />
                )}
              />
            }
            placeholder="Contraseña"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
        </View>
        <View className="mt-10 items-center px-20">
          <ThemedButton
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={handleLogin}
          >
            {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
          </ThemedButton>
        </View>

        {/* Derechos */}
        <AppFooter variant="inverted" />
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

export default LoginScreen;
