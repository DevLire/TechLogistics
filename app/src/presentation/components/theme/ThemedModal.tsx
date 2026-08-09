import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { ThemedView } from '@/presentation/components/theme/ThemedView';
import { ThemedText } from '@/presentation/components/theme/ThemedText';

interface Props extends ComponentProps<typeof ThemedView> {
  visible: boolean;
  title?: string;
  description?: string;
}

export const ThemedModal = ({
  visible,
  title = '',
  description = '',
  children,
  ...rest
}: Props) => {
  return (
    <Portal>
      <Modal visible={visible}>
        <View className="items-center justify-center">
          <ThemedView className="w-[90%] gap-5 rounded-3xl px-6 py-5" {...rest}>
            {/* Textos */}
            <View>
              <ThemedText className="text-center text-xl" type="semi-bold">
                {title}
              </ThemedText>
              <ThemedText className="text-center" type="normal">
                {description}
              </ThemedText>
            </View>
            <View>{children}</View>
          </ThemedView>
        </View>
      </Modal>
    </Portal>
  );
};
