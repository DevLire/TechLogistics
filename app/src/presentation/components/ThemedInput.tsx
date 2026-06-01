import type { ComponentProps } from 'react';
import { TextInput } from 'react-native-paper';
import { useTheme } from '@/hooks/use-theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps<typeof TextInput> {
  className?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const ThemedInput = ({
  className = '',
  iconName,
  style,
  onFocus,
  onBlur,
  ...rest
}: Props) => {
  const themePrimary = useTheme({}, 'primary');
  const themeOutline = useTheme({}, 'secondary');
  const themeTextMuted = useTheme({}, 'textMuted');
  const themeSurface = useTheme({}, 'surface');

  const [isFocused, setIsFocused] = useState(false);

  const classes = className.split(' ');
  const hasBgClass = classes.find((cls) => cls.startsWith('bg-'));
  const hasRoundedClass = classes.some((cls) => cls.startsWith('rounded-'));

  const getBackgroundColor = () => {
    if (hasBgClass) {
      return hasBgClass.replace('bg-', '');
    }
    return themeSurface;
  };

  const finalBgColor = getBackgroundColor();
  const finalBorderRadius = hasRoundedClass ? undefined : 14;

  return (
    <TextInput
      className={cn('font-inter text-text', className)}
      contentStyle={{
        borderRadius: finalBorderRadius,
      }}
      left={
        iconName ? (
          <TextInput.Icon
            icon={({ size, color }) => (
              <Ionicons color={color} name={iconName} size={size} />
            )}
            style={{ backgroundColor: 'transparent' }}
          />
        ) : undefined
      }
      mode="outlined"
      outlineStyle={{
        borderRadius: finalBorderRadius,
        borderColor: isFocused ? themePrimary : themeOutline,
        borderWidth: isFocused ? 2 : 1,
        backgroundColor: finalBgColor,
      }}
      style={[
        {
          fontSize: 15,
          backgroundColor: finalBgColor,
          borderRadius: finalBorderRadius,
        },
        style,
      ]}
      theme={{
        colors: {
          onSurfaceVariant: themeTextMuted,
          primary: themePrimary,
          background: finalBgColor,
        },
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
      }}
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
      }}
      {...rest}
    />
  );
};
