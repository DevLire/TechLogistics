import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AuthModal } from '@/presentation/components/auth/AuthModal';
import { useState } from 'react';
import { toast } from 'sonner-native';

const HomeScreen = () => {
  const { user, revalidatePassword } = useAuthStore();
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
      const isValid = await revalidatePassword(password);

      if (!isValid) {
        toast.error('Error al iniciar sesión', {
          description: 'Credenciales inválidas',
        });
        return;
      }
      setIsModalVisible(false);
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
      <View className="flex-1 gap-10">
        {/* Card */}
        <ThemedView className="bg-surface items-center justify-center rounded-3xl pt-10">
          <View>
            <TechLogisticsImagotipo height={200} width={270} />
          </View>
        </ThemedView>
        {/* Perfil */}

        {/* Labels */}
        <ThemedView margin className="flex-none items-center gap-5">
          <ThemedText className="text-3xl font-bold">{`${labelBienvenida}, ${user?.nombre}`}</ThemedText>
          <ThemedText
            className="text-center text-sm dark:text-white/35"
            type="normal"
          >
            Ingrese la huella digital asociada al dispositivo para poder
            ingresar al almacén
          </ThemedText>
        </ThemedView>
        {/* Huella */}
        <View className="items-center justify-center">
          <Ionicons
            className="color-black dark:color-white"
            name="finger-print"
            size={300}
          />
          <ThemedText
            className="mt-5"
            type="link"
            onPress={() => setIsModalVisible(true)}
          >
            ¿Este dispositivo no cuenta con huella?
          </ThemedText>
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
      </View>
      <View />
    </>
  );
};

export default HomeScreen;
