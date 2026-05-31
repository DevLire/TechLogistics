import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { TechLogisticsImagotipo } from '@/presentation/components/TechLogisticsImagotipo';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { capitalize } from '@/lib/utils';
import { List, Switch } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/hooks/use-theme';
import { ThemedButton } from '@/presentation/components/ThemedButton';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const textColor = useTheme({}, 'text');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <ThemedView className="flex-1">
        {/* Card */}
        <ThemedView className="bg-surface items-center justify-center rounded-3xl pt-10 pb-2">
          <View>
            <TechLogisticsImagotipo height={200} width={270} />
          </View>
        </ThemedView>

        {/* Opciones */}
        <ThemedView className="mt-5 ml-7">
          {/* Tema */}
          <View>
            <ThemedText className="text-2xl">Tema:</ThemedText>
            <List.Section titleStyle={{ fontSize: 20 }}>
              <View>
                <List.Item
                  left={() => (
                    <Ionicons
                      color={textColor}
                      name="contrast-outline"
                      size={24}
                      style={{ marginLeft: 8, alignSelf: 'center' }}
                    />
                  )}
                  right={() => <Switch />}
                  title="Claro o Oscuro"
                />
              </View>
            </List.Section>
          </View>

          {/* Información */}
          <View>
            <ThemedText className="text-2xl">Información:</ThemedText>
            <List.Section titleStyle={{ fontSize: 20 }}>
              <View>
                <List.Item
                  left={() => (
                    <Ionicons
                      color={textColor}
                      name="person-outline"
                      size={24}
                      style={{ marginLeft: 8, alignSelf: 'center' }}
                    />
                  )}
                  title={user?.nombre}
                />
              </View>
              <View>
                <List.Item
                  left={() => (
                    <Ionicons
                      color={textColor}
                      name="cube-outline"
                      size={24}
                      style={{ marginLeft: 8, alignSelf: 'center' }}
                    />
                  )}
                  title={capitalize(user?.rol ?? '')}
                />
              </View>
              <View>
                <List.Item
                  left={() => (
                    <Ionicons
                      color={textColor}
                      name="phone-portrait-outline"
                      size={24}
                      style={{ marginLeft: 8, alignSelf: 'center' }}
                    />
                  )}
                  title="3 Dispositivos vinculados"
                />
              </View>
            </List.Section>
          </View>

          {/* Cerrar sesión */}
          <View className="mt-5">
            <ThemedButton onPress={logout}>Cerrar sesión</ThemedButton>
          </View>
        </ThemedView>
      </ThemedView>
    </>
  );
};

export default ProfileScreen;
