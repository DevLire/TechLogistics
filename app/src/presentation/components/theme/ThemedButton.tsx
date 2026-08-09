import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Button } from 'react-native-paper';

interface Props extends ComponentProps<typeof Button> {
  className?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const ThemedButton = ({ className = '', children, ...rest }: Props) => {
  const themePrimary = useTheme({}, 'primary');
  const themeSurface = useTheme({}, 'surface');

  const rippleColor = `${themePrimary}20`;

  const classes = className.split(' ');

  const _hola = 'xd';

  const hasBg = classes.some((c) => c.startsWith('bg-'));
  const hasWidth = classes.some((c) => c.startsWith('w-'));
  const hasRound = classes.some((c) => c.startsWith('rounded'));

  return (
    <Button
      className={cn(className)}
      contentStyle={{
        paddingVertical: 5,
        paddingHorizontal: 5,
        width: '100%',
      }}
      labelStyle={{ color: themePrimary }}
      mode="contained"
      rippleColor={rippleColor}
      style={[
        {
          backgroundColor: hasBg ? undefined : themeSurface,
          width: hasWidth ? undefined : '100%',
          borderRadius: hasRound ? undefined : 8,
          overflow: 'hidden',
        },
        rest.style,
      ]}
      {...rest}
    >
      {children}
    </Button>
  );
};
