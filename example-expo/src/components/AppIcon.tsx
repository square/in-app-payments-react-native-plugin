import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';
import {
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type AppIconName = keyof typeof Ionicons.glyphMap;

export function AppIcon({
  name,
  onPress,
  size = dimensions.lg,
  color = colors.onBackground,
  style,
}: {
  name: AppIconName;
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} hitSlop={5} style={style}>
        <Ionicons name={name} size={size} color={color} />
      </TouchableOpacity>
    );
  }
  return (
    <View style={style}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}
