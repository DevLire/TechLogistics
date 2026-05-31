import { Image } from 'expo-image';
import type { ComponentProps } from 'react';

const imagotipo = require('@/assets/imagotipo.png');

interface Props extends ComponentProps<typeof Image> {
  height: number;
  width: number;
}

export const TechLogisticsImagotipo = ({ height, width, ...rest }: Props) => {
  return (
    <Image
      contentFit="fill"
      source={imagotipo}
      style={{
        height: height,
        width: width,
      }}
      {...rest}
    />
  );
};
