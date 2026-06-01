import type { ComponentProps, JSX } from 'react';
import { View } from 'react-native';
import type { TextInput } from 'react-native-paper';
import { Modal, Portal } from 'react-native-paper';
import { ThemedView } from '@/presentation/components/ThemedView';
import { ThemedText } from '@/presentation/components/ThemedText';
import { ThemedInput } from '@/presentation/components/ThemedInput';
import { ThemedButton } from '@/presentation/components/ThemedButton';

interface Props extends ComponentProps<typeof ThemedView> {
  visible: boolean;
  title?: string;
  description?: string;
  action?: JSX.Element;
  onDismiss: () => void;
  passwordValue: string;
  onPasswordChange: React.ComponentProps<typeof TextInput>['onChangeText'];
  onPress: () => void;
  isSubmitting: boolean;
}

export const AuthModal = ({
  visible,
  title = '',
  description = '',
  onDismiss,
  passwordValue,
  onPasswordChange,
  onPress,
  isSubmitting,
  ...rest
}: Props) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <View className="items-center justify-center">
          <ThemedView className="w-[90%] gap-5 rounded-3xl px-6 py-5" {...rest}>
            {/* Textos */}
            <View className="items-center">
              <ThemedText className="text-xl" type="semi-bold">
                {title}
              </ThemedText>
              <ThemedText className="text-center" type="normal">
                {description}
              </ThemedText>
            </View>
            {/* Input */}
            <ThemedInput
              secureTextEntry
              autoCapitalize="none"
              iconName="key-outline"
              placeholder="Ingrese su contraseña"
              value={passwordValue}
              onChangeText={onPasswordChange}
            />
            {/* Botón */}
            <ThemedButton
              disabled={isSubmitting}
              loading={isSubmitting}
              onPress={onPress}
            >
              Ingresar al almacén
            </ThemedButton>
          </ThemedView>
        </View>
      </Modal>
    </Portal>
  );
};
