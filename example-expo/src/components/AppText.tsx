import { type StyleProp, Text, type TextStyle } from 'react-native';
import { colors } from '../constants/colors';

export type AppTextSize = 'body' | 'h1' | 'h2' | 'h3' | 'h4' | 'caption';
export type AppTextWeight = 'normal' | 'bold';

const getSizeStyle = (size: AppTextSize) => {
  switch (size) {
    case 'body':
      return 16;
    case 'h1':
      return 24;
    case 'h2':
      return 20;
    case 'h3':
      return 18;
    case 'h4':
      return 16;
    case 'caption':
      return 12;
  }
};

export function AppText({
  size = 'body',
  weight = 'normal',
  children,
  style,
}: {
  size?: AppTextSize;
  weight?: AppTextWeight;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        {
          fontSize: getSizeStyle(size),
          fontWeight: weight,
          color: colors.onBackground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
