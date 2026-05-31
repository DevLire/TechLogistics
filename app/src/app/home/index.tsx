import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { ThemedButton } from '@/presentation/components/ThemedButton';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdAction } from '@/core/actions/user/get-user-by-id.action';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

const HomeScreen = () => {
  const { logout, user } = useAuthStore();
  const { data: userData } = useQuery({
    queryKey: ['user', user?.id_usuario],
    queryFn: () => getUserByIdAction(user?.id_usuario ?? 0),
  });
  console.log(userData?.data + ' usuario');

  const hours = new Date().getHours();
  const labelBienvenida =
    hours < 6
      ? 'Buenas noches'
      : hours < 12
        ? 'Buenos días'
        : hours < 18
          ? 'Buenas tardes'
          : 'Buenas noches';

  return (
    <ThemedView className="gap-10">
      {/* Card */}
      <ThemedView className="bg-surface items-center justify-center rounded-3xl pt-10">
        <View>
          <TechLogisticsImagotipo height={200} width={270} />
        </View>
        <View></View>
      </ThemedView>
      {/* Labels */}
      <ThemedView margin className="flex-none items-center gap-5">
        <ThemedText className="text-3xl font-bold">{`${labelBienvenida}, ${user?.nombre}`}</ThemedText>
        <ThemedText
          className="text-center text-sm dark:text-white/35"
          type="normal"
        >
          Ingrese la huella digital asociada al dispositivo para poder ingresar
          al almacén
        </ThemedText>
      </ThemedView>
      {/* Huella */}
      <ThemedView className="items-center justify-center">
        <Ionicons
          className="color-black dark:color-white"
          name="finger-print"
          size={300}
        />
        <ThemedText className="mt-5" type="link">
          ¿Este dispositivo no cuenta con huella?
        </ThemedText>
      </ThemedView>
      <ThemedButton onPress={logout}>Cerrar sesión</ThemedButton>
    </ThemedView>
  );
};

export default HomeScreen;
