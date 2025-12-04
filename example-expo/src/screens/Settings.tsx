import { Image, Switch, View } from 'react-native';
import { AppText } from '../components/AppText';
import { AppPage } from '../components/AppPage';
import { StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsProvider';
import { dimensions } from '../constants/dimensions';
import { colors } from '../constants/colors';
import { router } from 'expo-router';
import { AppIcon } from '../components/AppIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../constants/strings';

export function Settings() {
  const {
    useMockBackend,
    setUseMockBackend,
    useDeprecatedMethods,
    setUseDeprecatedMethods,
    useWithBuyerVerification,
    setUseWithBuyerVerification,
    mockBuyerVerificationSuccess,
    setMockBuyerVerificationSuccess,
  } = useSettings();
  const { top } = useSafeAreaInsets();
  return (
    <AppPage style={styles.page}>
      <View style={[styles.floatingButton, { top: top + dimensions.xl }]}>
        <AppIcon
          color={colors.onBackground}
          name="arrow-back-outline"
          onPress={() => {
            router.canGoBack() ? router.back() : router.replace('/');
          }}
        />
      </View>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/cookie.png')}
          resizeMode="contain"
          style={styles.logo}
        />
        <AppText size="h1" weight="bold">
          Settings
        </AppText>
      </View>
      <View style={styles.settings}>
        <View style={styles.row}>
          <AppText size="body">Mock charge service</AppText>
          <Switch
            trackColor={{ false: colors.surface, true: colors.primary }}
            thumbColor={colors.primary}
            value={useMockBackend}
            onValueChange={setUseMockBackend}
          />
        </View>
        <View style={styles.row}>
          <AppText size="body">Mock buyer verification success</AppText>
          <Switch
            trackColor={{ false: colors.surface, true: colors.primary }}
            thumbColor={colors.primary}
            value={mockBuyerVerificationSuccess}
            onValueChange={setMockBuyerVerificationSuccess}
          />
        </View>
        <View style={styles.row}>
          <AppText size="body">Use deprecated methods</AppText>
          <Switch
            trackColor={{ false: colors.surface, true: colors.primary }}
            thumbColor={colors.primary}
            value={useDeprecatedMethods}
            onValueChange={setUseDeprecatedMethods}
          />
        </View>
        <View style={styles.row}>
          <AppText size="body">Use with buyer verification</AppText>
          <Switch
            trackColor={{ false: colors.surface, true: colors.primary }}
            thumbColor={colors.primary}
            value={useWithBuyerVerification}
            onValueChange={setUseWithBuyerVerification}
          />
        </View>
      </View>
      <View style={styles.footnotes}>
        <AppText size="body" weight="bold" style={styles.footnote}>
          Apple Pay Merchant ID:{'\n'}
          <AppText size="caption">{strings.APPLE_PAY_MERCHANT_ID}</AppText>
        </AppText>
        <AppText size="body" weight="bold" style={styles.footnote}>
          Google Pay Location ID:{'\n'}
          <AppText size="caption">{strings.GOOGLE_PAY_LOCATION_ID}</AppText>
        </AppText>
        <AppText size="body" weight="bold" style={styles.footnote}>
          Square Application ID:{'\n'}
          <AppText size="caption">{strings.SQUARE_APP_ID}</AppText>
        </AppText>
        <AppText size="body" weight="bold" style={styles.footnote}>
          Square Location ID:{'\n'}
          <AppText size="caption">{strings.SQUARE_LOCATION_ID}</AppText>
        </AppText>
        <AppText size="body" weight="bold" style={styles.footnote}>
          Charge Server URL:{'\n'}
          <AppText size="caption">{strings.CHARGE_SERVER_URL}</AppText>
        </AppText>
      </View>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 100,
    gap: dimensions.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingButton: {
    position: 'absolute',
    left: dimensions.xl,
  },
  footnote: {
    textAlign: 'center',
    color: colors.primary,
  },
  footnotes: {
    width: '100%',
    gap: dimensions.xs,
    alignItems: 'center',
  },
  settings: {
    width: '100%',
    gap: dimensions.md,
  },
});
