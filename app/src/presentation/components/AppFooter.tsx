import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { nativeApplicationVersion } from 'expo-application';

import { ThemedText } from '@/presentation/components/theme/ThemedText';

import type { ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface Props extends ViewProps {
  position?: 'absolute' | 'relative';
  variant?: 'default' | 'inverted';
  className?: string;
}

const TEXTVARIANTS = {
  default: 'text-text',
  inverted: 'text-text-inverse dark:text-text',
};

export const AppFooter = ({
  position = 'absolute',
  variant = 'default',
  className,
  style,
  ...rest
}: Props) => {
  const { bottom } = useSafeAreaInsets();

  const year = new Date().getFullYear();

  return (
    <View
      className={cn(
        'w-full items-center',
        position === 'absolute' && 'absolute',
        className
      )}
      style={[position === 'absolute' && { bottom: bottom + 10 }, style]}
      {...rest}
    >
      <ThemedText className={TEXTVARIANTS[variant]} type="normal">
        © {year} TechLogistics App v{nativeApplicationVersion}
      </ThemedText>
    </View>
  );
};
