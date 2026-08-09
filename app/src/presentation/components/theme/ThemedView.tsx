import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

interface Props extends ViewProps {
  className?: string;
  margin?: boolean;
  safe?: boolean;
  bgColor?: string;
}

export const ThemedView = ({
  style,
  className = '',
  margin = false,
  children,
  safe = false,
  bgColor,
  ...rest
}: Props) => {
  const themeBackgroundColor = useTheme({}, 'background');
  const { top } = useSafeAreaInsets();

  const classes = className.split(' ');
  const hasBgClass = classes.some((cls) => cls.startsWith('bg-'));

  const hasPaddingTop = classes.some(
    (cls) =>
      cls.startsWith('pt-') || cls.startsWith('py-') || cls.startsWith('p-')
  );

  return (
    <View
      className={cn(className)}
      style={[
        {
          backgroundColor: bgColor
            ? bgColor
            : !hasBgClass
              ? themeBackgroundColor
              : undefined,
          paddingTop: safe ? top : hasPaddingTop ? undefined : 0,
          marginHorizontal: margin ? 10 : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};
