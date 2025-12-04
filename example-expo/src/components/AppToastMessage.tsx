import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, PanResponder, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { dimensions } from '../constants/dimensions';
import { AppText } from './AppText';
import { AppIcon } from './AppIcon';

export interface AppToastMessageRef {
  show: (options: {
    title: string;
    description: string;
    status: boolean;
  }) => void;
  hide: () => void;
}

type Props = {};

const FADE_DURATION = 200;
const DURATION = 20000;
const INITIAL_Y = -200;
const FINAL_Y = 0;

export const AppToastMessage = forwardRef<AppToastMessageRef, Props>(
  (_, ref) => {
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState({
      title: '',
      description: '',
      status: true,
    });
    const opacity = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(true);
    const translateY = useRef(new Animated.Value(INITIAL_Y)).current;
    const dragY = useRef(new Animated.Value(0)).current;

    const clearTimer = useCallback(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const animateTo = useCallback(
      (toOpacity: number, toTranslateY: number, onEnd?: () => void) => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: toOpacity,
            duration: FADE_DURATION,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: toTranslateY,
            duration: FADE_DURATION,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onEnd) onEnd();
        });
      },
      [opacity, translateY]
    );

    const hide = useCallback(() => {
      clearTimer();
      animateTo(0, INITIAL_Y, () => {
        if (!isMountedRef.current) return;
        setVisible(false);
        dragY.setValue(0);
      });
    }, [animateTo, clearTimer, dragY]);

    const show = useCallback(
      (options: { title: string; description: string; status: boolean }) => {
        clearTimer();
        setContent(options);
        if (!visible) setVisible(true);
        animateTo(1, FINAL_Y);
        const timeout = DURATION;
        timerRef.current = setTimeout(
          () => {
            hide();
          },
          Math.max(0, timeout)
        );
      },
      [animateTo, clearTimer, DURATION, hide, visible]
    );

    useImperativeHandle(ref, () => ({ show, hide }), [show, hide]);

    const topOffset = useMemo(() => insets.top + dimensions.sm, [insets.top]);

    React.useEffect(() => {
      return () => {
        isMountedRef.current = false;
        clearTimer();
      };
    }, [clearTimer]);

    const panResponderRef = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_e, g) => g.dy < -2,
        onPanResponderGrant: () => {
          dragY.stopAnimation();
        },
        onPanResponderMove: (_e, g) => {
          const next = g.dy < 0 ? g.dy : 0;
          dragY.setValue(next);
        },
        onPanResponderRelease: (_e, g) => {
          const fastUp = g.vy < -0.6;
          const threshold = fastUp ? -10 : -50;
          if (g.dy < threshold) {
            hide();
          } else {
            Animated.spring(dragY, {
              toValue: 0,
              damping: 20,
              stiffness: 200,
              mass: 1,
              velocity: Math.min(Math.abs(g.vy), 2),
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderTerminate: () => {
          Animated.spring(dragY, {
            toValue: 0,
            damping: 20,
            stiffness: 200,
            mass: 1,
            useNativeDriver: true,
          }).start();
        },
      })
    ).current;

    return (
      <View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.root, { top: topOffset }]}
      >
        <Animated.View
          style={[
            styles.toast,
            {
              opacity,
              transform: [{ translateY: Animated.add(translateY, dragY) }],
            },
          ]}
          {...panResponderRef.panHandlers}
        >
          <AppIcon
            name={content.status ? 'checkmark-circle' : 'close-circle'}
            color={content.status ? colors.primary : colors.error}
            size={dimensions.lg}
          />
          <View style={styles.content}>
            <AppText size="h3" weight="bold" style={styles.text}>
              {content.title}
            </AppText>
            <AppText size="body" style={styles.description}>
              {content.description}
            </AppText>
          </View>
          <AppIcon
            name="close"
            onPress={hide}
            color={colors.onSurface}
            size={dimensions.lg}
            style={styles.close}
          />
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  content: {
    flex: 1,
    gap: dimensions.xs,
  },
  toast: {
    padding: dimensions.md,
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.md,
    backgroundColor: colors.surface,
    borderRadius: dimensions.md,
  },
  text: {
    color: colors.primary,
  },
  description: {
    color: colors.onSurface,
  },
  close: {
    position: 'absolute',
    top: dimensions.md,
    right: dimensions.md,
  },
});
