import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { ImageBackground } from 'expo-image';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/components/ThemedText';
import { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedInput } from '@/presentation/components/ThemedInput';
import { ThemedButton } from '@/presentation/components/ThemedButton';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { toast } from 'sonner-native';
import { router } from 'expo-router';
import { regularExps } from '@/config/regular-exp';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');
const imagotipo = require('@/assets/imagotipo.png');

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const safeArea = useSafeAreaInsets();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleLogin = async () => {
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
      setIsSubmiting(true);
      const isValid = await login(form.email, form.password);

      if (!isValid) {
        toast.error('Error al iniciar sesión', {
          description: 'Credenciales inválidas',
        });
        return;
      }
      router.replace('/home');
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado', { description: 'Inténtalo de nuevo' });
    } finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <ImageBackground
      contentFit="cover"
      source={colorScheme === 'light' ? bgLight : bgDark}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: safeArea.bottom + keyboardHeight + 20,
          }}
          keyboardDismissMode="on-drag"
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
              label="Correo electrónico"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <ThemedInput
              secureTextEntry
              autoCapitalize="none"
              label="Contraseña"
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
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
          </View>
          <View className="mt-10 items-center px-20">
            <ThemedButton
              disabled={isSubmiting}
              loading={isSubmiting}
              onPress={handleLogin}
            >
              {isSubmiting ? 'Cargando...' : 'Iniciar sesión'}
            </ThemedButton>
          </View>

          <View
            className="absolute w-full items-center"
            style={{ bottom: safeArea.bottom + 10 }}
          >
            <ThemedText
              className="text-text-inverse dark:text-text"
              type="normal"
            >
              Todos los derechos reservados ©
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
