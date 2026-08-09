import { ImageBackground } from 'expo-image';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '@/presentation/hooks/use-color-scheme';
import { ThemedText } from '@/presentation/components/theme/ThemedText';

const bgLight = require('@/assets/loginLightBg.png');
const bgDark = require('@/assets/loginDarkBg.png');

const TechLogisticsApp = () => {
  const colorScheme = useColorScheme();

  return (
    <ImageBackground
      cachePolicy="memory-disk"
      priority="high"
      source={colorScheme === 'light' ? bgLight : bgDark}
      style={{ flex: 1 }}
      transition={300}
    >
      <View className="flex-1 items-center justify-center gap-5">
        <ActivityIndicator className="color-primary" size={60} />
        <ThemedText type="h2">Cargando...</ThemedText>
        <ThemedText type="semi-bold">
          Preparando la mejor experiencia
        </ThemedText>
      </View>
    </ImageBackground>
  );
};

export default TechLogisticsApp;
