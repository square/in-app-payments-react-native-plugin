import {
  StyleSheet,
  TouchableOpacity,
  type PressableProps,
  type ViewStyle,
  type StyleProp,
  ActivityIndicator,
  View,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';
import { AppIcon, AppIconName } from './AppIcon';

export function AppButton({
  leadingIconName,
  label,
  type = 'primary',
  onPress,
  isLoading = false,
  style,
}: PressableProps & {
  leadingIconName?: AppIconName;
  label: string;
  type?: 'primary' | 'secondary';
  onPress?: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const buttonStyle =
    type === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const buttonTextStyle =
    type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle, style] as any}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonTextStyle.color} />
      ) : (
        <View style={styles.buttonContent}>
          {leadingIconName ? (
            <AppIcon
              name={leadingIconName}
              size={dimensions.lg}
              color={buttonTextStyle.color}
            />
          ) : null}
          <AppText size="body" weight="bold" style={buttonTextStyle}>
            {label}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function AppImageButton({
  image,
  onPress,
  type = 'primary',
  isLoading = false,
  style,
  disabled = false,
}: PressableProps & {
  image: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary';
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const buttonStyle =
    type === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const buttonTextStyle =
    type === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText;

  const buttonDisabledStyle = disabled ? styles.disabledButton : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, buttonStyle, style, buttonDisabledStyle]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonTextStyle.color} />
      ) : image ? (
        image
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: dimensions.md,
    borderRadius: dimensions.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  primaryButtonText: {
    color: colors.onPrimary,
  },
  secondaryButtonText: {
    color: colors.onSecondary,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: dimensions.sm,
  },
});
