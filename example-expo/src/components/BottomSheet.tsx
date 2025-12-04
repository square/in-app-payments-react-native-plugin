import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dimensions } from '../constants/dimensions';
import { AppIcon } from './AppIcon';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export interface BottomSheetProps {
  title?: string;
  children?: React.ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ title, children }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const sheetHeightRef = useRef(0);
    const inset = useSafeAreaInsets();

    useImperativeHandle(ref, () => ({
      open: () => handleOpen(),
      close: () => handleClose(),
    }));

    const handleClose = () => {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setIsOpen(false);
    };

    const handleOpen = () => {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setIsOpen(true);
    };

    return (
      <>
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
          pointerEvents={'none'}
        />
        <Modal
          onRequestClose={() => handleClose()}
          visible={isOpen}
          transparent={true}
          statusBarTranslucent={true}
          animationType="slide"
        >
          <View style={styles.container}>
            <Pressable
              onPress={() => handleClose()}
              style={styles.overlayPressable}
            />
            <Animated.View
              style={[
                styles.content,
                {
                  paddingBottom: inset.bottom + dimensions.md,
                  paddingHorizontal: dimensions.md,
                  paddingTop: dimensions.md,
                },
              ]}
              onLayout={(e) => {
                sheetHeightRef.current = e.nativeEvent.layout.height;
              }}
            >
              <View style={styles.dragHandle}>
                <TouchableOpacity hitSlop={5} style={styles.dragHandleInner} />
              </View>
              <View style={styles.header}>
                <AppIcon
                  name="close"
                  color={colors.onSurface}
                  style={styles.closeIcon}
                  onPress={() => handleClose()}
                />
                <AppText size="h3" weight="bold" style={styles.title}>
                  {title}
                </AppText>
              </View>
              {children}
            </Animated.View>
          </View>
        </Modal>
      </>
    );
  }
);

const styles = StyleSheet.create<{
  container: ViewStyle;
  content: ViewStyle;
  overlay: ViewStyle;
  overlayPressable: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  closeIcon: ViewStyle;
  dragHandleInner: ViewStyle;
  dragHandle: ViewStyle;
}>({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderTopRightRadius: dimensions.md,
    borderTopLeftRadius: dimensions.md,
    gap: dimensions.md,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayPressable: {
    flex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: colors.onSurface,
  },
  closeIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  dragHandleInner: {
    width: 40,
    height: 4,
    backgroundColor: colors.onSurface + '50',
    borderRadius: dimensions.md,
  },
  dragHandle: {
    width: '100%',
    alignItems: 'center',
  },
});
