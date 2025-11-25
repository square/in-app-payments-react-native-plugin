import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dimensions } from '../constants/dimensions';

export function AppPage({
  children,
  safe = true,
  scroll = false,
  style,
}: {
  children?: React.ReactNode;
  safe?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const inset = useSafeAreaInsets();

  if (scroll) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: safe ? inset.top + dimensions.lg : dimensions.lg,
            paddingBottom: safe ? inset.bottom + dimensions.lg : dimensions.lg,
          },
          style,
        ]}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View
      style={[
        styles.container,
        styles.contentContainer,
        {
          paddingTop: safe ? inset.top + dimensions.lg : dimensions.lg,
          paddingBottom: safe ? inset.bottom + dimensions.lg : dimensions.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: dimensions.md,
    gap: dimensions.md,
  },
});
