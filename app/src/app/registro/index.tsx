import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { ThemedInput } from '@/presentation/components/ThemedInput';
import { ThemedButton } from '@/presentation/components/ThemedButton';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';

import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useRegisterDevice } from '@/presentation/hooks/useRegisterDevice';

const RegistroScreen = () => {
  const { user, logout } = useAuthStore();
  const { handleBiometricAuth } = useRegisterDevice();

  const [deviceName, setDeviceName] = useState('');

  return (
    <ThemedView safe className="flex-1">
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado e Imagotipo */}
        <ThemedView className="bg-surface pt- items-center justify-center rounded-b-3xl pb-8 shadow-sm">
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

        {/* 🌟 Sensor de Huella (Este sí toma el espacio sobrante) */}
        <View className="mt-10 mb-8 flex-1 items-center justify-center">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleBiometricAuth()} // Le pasamos el texto al hook
          >
            <Ionicons className="color-text" name="finger-print" size={260} />
          </TouchableOpacity>

          <ThemedText className="mt-4 text-sm dark:text-white/40" type="normal">
            Toca el icono para escanear biometría
          </ThemedText>
        </View>

        {/* Botón de salida */}
        <View className="mt-auto mb-8 px-6">
          <ThemedButton className="border-outline border" onPress={logout}>
            Cancelar y cerrar sesión
          </ThemedButton>
        </View>
      </KeyboardAwareScrollView>
    </ThemedView>
  );
};

export default RegistroScreen;
