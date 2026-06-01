import { Stack } from 'expo-router';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { List } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';

import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { ThemedButton } from '@/presentation/components/ThemedButton';
import { useTheme } from '@/hooks/use-theme';

import { useAuthStore } from '@/stores/auth/useAuthStore';
import { capitalize } from '@/lib/utils';
import { getUserStatsAction } from '@/core/actions/users/get-stats.action';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const textColor = useTheme({}, 'text');
  const errorColor = useTheme({}, 'error');
  const successColor = useTheme({}, 'success');
  const primaryColor = useTheme({}, 'primary');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id_usuario],
    queryFn: getUserStatsAction,
  });

  console.log({ stats });

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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Cabecera / Identificación */}
          <ThemedView className="bg-surface items-center justify-center rounded-b-3xl pt-10 pb-8 shadow-sm">
            <View className="bg-primary/10 mb-4 rounded-full p-5">
              <Ionicons
                color={useTheme({}, 'primary')}
                name="person"
                size={60}
              />
            </View>
            <ThemedText className="text-3xl font-bold">
              {user?.nombre}
            </ThemedText>
            <ThemedText className="text-md dark:text-white/50">
              {user?.email}
            </ThemedText>

            {/* Badge de Rol */}
            <View className="bg-tertiary mt-3 rounded-full px-4 py-1">
              <ThemedText className="text-primary text-sm font-bold">
                {capitalize(user?.rol ?? '')}
              </ThemedText>
            </View>
          </ThemedView>

          {/* Opciones del Perfil */}
          <ThemedView className="mt-6 px-4">
            {/* Sección: Seguridad y Dispositivo */}
            <List.Section
              title="Seguridad y Acceso"
              titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            >
              <ThemedView className="bg-surface overflow-hidden rounded-2xl">
                <List.Item
                  description="Acceso principal habilitado"
                  left={(props) => (
                    <List.Icon
                      {...props}
                      color={textColor}
                      icon="fingerprint"
                    />
                  )}
                  right={(props) => (
                    <List.Icon
                      {...props}
                      color={successColor}
                      icon="check-circle"
                    />
                  )}
                  title="Biometría activa"
                />
                <List.Item
                  description={`${user?.dispositivos?.length || 0} terminales autorizadas`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      color={textColor}
                      icon="cellphone-link"
                    />
                  )}
                  title="Dispositivos vinculados"
                />
              </ThemedView>
            </List.Section>

            {/* Sección: Actividad Operativa */}
            <List.Section
              title="Mi Actividad"
              titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            >
              <ThemedView className="bg-surface min-h-[70px] justify-center overflow-hidden rounded-2xl">
                {isLoading ? (
                  <ActivityIndicator color={primaryColor} size="large" />
                ) : (
                  <>
                    <List.Item
                      description={`${stats?.movimientos_hoy || 0} registros procesados`}
                      left={(props) => (
                        <List.Icon
                          {...props}
                          color={textColor}
                          icon="swap-horizontal"
                        />
                      )}
                      title="Movimientos de hoy"
                    />
                  </>
                )}
              </ThemedView>
            </List.Section>

            {/* Cerrar sesión */}
            <View className="mt-8 px-2">
              <ThemedButton
                labelStyle={{ color: errorColor }}
                style={{
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: errorColor,
                }}
                onPress={logout}
              >
                Cerrar sesión de forma segura
              </ThemedButton>
              <ThemedText className="mt-4 text-center text-xs dark:text-white/30">
                TechLogistics App v1.0.0
              </ThemedText>
            </View>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
  );
};

export default ProfileScreen;
