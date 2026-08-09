import { useTheme } from '@/hooks/use-theme';
import { Platform, Pressable, Switch, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface Props {
  text?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
}

const isAndroid = Platform.OS === 'android';

export const ThemedSwitch = ({
  text,
  value,
  className,
  onValueChange,
}: Props) => {
  const switchActiveColor = useTheme({}, 'primary');

  return (
    <Pressable
      className={`mx-2 flex flex-row items-center justify-between active:opacity-80 ${className}`}
      onPress={() => onValueChange(!value)}
    >
      {text ? <ThemedText type="h2">{text}</ThemedText> : <View />}
      <Switch
        thumbColor={isAndroid ? switchActiveColor : ''}
        trackColor={{ false: 'grey', true: switchActiveColor }}
        value={value}
        onValueChange={onValueChange}
      />
    </Pressable>
  );
};
