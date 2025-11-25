import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { AppText } from '../components/AppText';
import { AppButton, AppImageButton } from '../components/AppButton';
import { BottomSheet } from '../components/BottomSheet';
import type { BottomSheetRef } from '../components/BottomSheet';
import { AppPage } from '../components/AppPage';
import { dimensions } from '../constants/dimensions';
import {
  SQIPCardEntry,
  SQIPBuyer,
  SQIPCore,
  SQIPGooglePay,
  SQIPApplePay,
  type CardEntryConfig,
  type CardDetails,
  type NonceSuccessCallbackWithResult,
  NonceSuccessCallback,
  GooglePayEnvironment,
  GooglePayPriceStatus,
  ErrorDetails,
  VerificationResult,
  GooglePayConfig,
  ThemeType,
  PaymentType,
  ApplePayNonceSuccessState,
  ApplePayNonceSuccessCallbackWithResult,
} from 'react-native-square-in-app-payments';
import { strings } from '../constants/strings';
import { hexToRgba } from '../utils';
import {
  MockChargeService,
  ChargeService,
  type ChargeServiceInterface,
} from '../services/ChargeService';
import {
  AlertValue,
  CommonAlert,
  type CommonAlertRef,
} from '../components/CommonAlert';
import { useSettings } from '../context/SettingsProvider';
import { router } from 'expo-router';
import { AppIcon } from '../components/AppIcon';
import { colors } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppToastMessage,
  type AppToastMessageRef,
} from '../components/AppToastMessage';

// Mock data
const paymentSourceId = 'ccof:customer-card-id-requires-verification';
const cardEntryConfig: CardEntryConfig = {
  collectPostalCode: true,
  squareLocationId: strings.SQUARE_LOCATION_ID,
  buyerAction: 'Charge',
  amount: 100,
  currencyCode: 'USD',
  givenName: 'John',
  familyName: 'Doe',
  addressLines: ['London Eye', 'Riverside Walk'],
  city: 'London',
  countryCode: 'GB',
  email: 'johndoe@example.com',
  phone: '8001234567',
  postalCode: 'SE1 7',
};
const googlePayConfig: GooglePayConfig = {
  price: '1.00',
  currencyCode: 'USD',
  priceStatus: GooglePayPriceStatus.TotalPriceStatusFinal,
};
const cardEntryTheme: ThemeType = {
  saveButtonFont: { size: 16, name: 'Roboto' },
  saveButtonTitle: 'Pay for 🍪',
  keyboardAppearance: 'Light',
  tintColor: hexToRgba('#23988c', 0.9),
  textColor: hexToRgba('#23988c', 0.9),
  font: { name: 'Roboto', size: 16 },
  backgroundColor: hexToRgba('#ffffff'),
  placeholderTextColor: hexToRgba('#23988c'),
  messageColor: hexToRgba('#23988c'),
  errorColor: hexToRgba('#FF0000'),
  saveButtonTextColor: hexToRgba('#ffffff'),
};
const darkCardEntryTheme: ThemeType = {
  saveButtonFont: { size: 16, name: 'Roboto' },
  saveButtonTitle: 'Pay for 🍪',
  keyboardAppearance: 'Dark',
  tintColor: hexToRgba('#23988c', 0.9),
  textColor: hexToRgba('#ffffff'),
  font: { name: 'Roboto', size: 16 },
  backgroundColor: hexToRgba('#202020'),
  placeholderTextColor: hexToRgba('#fefefe'),
  messageColor: hexToRgba('#ffffff'),
  errorColor: hexToRgba('#FF0000'),
  saveButtonTextColor: hexToRgba('#ffffff'),
};
const applePayConfig = {
  price: '1.00',
  summaryLabel: 'Test Item',
  countryCode: 'US',
  currencyCode: 'USD',
  paymentType: PaymentType.PaymentTypeFinal,
};
const applePayStatus = {
  none: 0,
  succeeded: 1,
  nonceNotCharged: 2,
};

export function Home() {
  const { useMockBackend, useDeprecatedMethods, useWithBuyerVerification } =
    useSettings();
  const { top } = useSafeAreaInsets();
  const [chargeService, setChargeService] = useState<ChargeServiceInterface>(
    new MockChargeService()
  );

  /** @deprecated see handleRequestApplePayNonce */
  const [applePayState, setApplePayState] = useState(applePayStatus.none);
  /** @deprecated see handleRequestApplePayNonce */
  const [applePayError, setApplePayError] = useState<string | null>(null);

  const [canUseDigitalWallet, setCanUseDigitalWallet] = useState(false);
  const [canUseDigitalWalletStep, setCanUseDigitalWalletStep] = useState(false);
  const colorScheme = useColorScheme();

  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const commonAlertRef = useRef<CommonAlertRef>(null);
  const appToastMessageRef = useRef<AppToastMessageRef>(null);

  useEffect(() => {
    SQIPCore.setSquareApplicationId(strings.SQUARE_APP_ID);
    if (Platform.OS === 'android') {
      SQIPGooglePay.initializeGooglePay(
        strings.GOOGLE_PAY_LOCATION_ID,
        GooglePayEnvironment.EnvironmentTest
      );
    } else if (Platform.OS === 'ios') {
      SQIPApplePay.initializeApplePay(strings.APPLE_PAY_MERCHANT_ID);
    }
    setCanUseDigitalWalletStep(true);
  }, []);

  useEffect(() => {
    if (!canUseDigitalWalletStep) return;
    (async () => {
      if (Platform.OS === 'android') {
        try {
          const canUseGooglePay = await SQIPGooglePay.canUseGooglePay();
          setCanUseDigitalWallet(canUseGooglePay);
        } catch (error) {
          setCanUseDigitalWallet(false);
        }
      } else if (Platform.OS === 'ios') {
        try {
          const canUseApplePay = await SQIPApplePay.canUseApplePay();
          setCanUseDigitalWallet(canUseApplePay);
        } catch (error) {
          setCanUseDigitalWallet(false);
        }
      }
    })();
  }, [canUseDigitalWalletStep]);

  useEffect(() => {
    if (useMockBackend) {
      setChargeService(new MockChargeService());
    } else {
      setChargeService(new ChargeService());
    }
  }, [useMockBackend]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (colorScheme === 'dark') {
        SQIPCardEntry.setIOSCardEntryTheme(darkCardEntryTheme);
      } else {
        SQIPCardEntry.setIOSCardEntryTheme(cardEntryTheme);
      }
    }
  }, [colorScheme]);

  const showCommonAlert = useCallback(
    (alertValue: AlertValue) => {
      // iOS cant perform two modal at the same time, so we need to close the bottom sheet first
      // But don't worry, now, the CardEntryForm modal can be displayed over a React Native modal.
      if (useWithBuyerVerification || Platform.OS === 'ios')
        bottomSheetRef.current?.close();
      setTimeout(() => {
        commonAlertRef.current?.showAlert(alertValue);
      }, 100);
    },
    // if useWithBuyerVerification close el bottom sheet to show the top toast message
    [useWithBuyerVerification]
  );

  const showToastMessage = useCallback(
    (options: { title: string; description: string; status: boolean }) => {
      if (useWithBuyerVerification || Platform.OS === 'ios')
        bottomSheetRef.current?.close();
      setTimeout(() => {
        appToastMessageRef.current?.show(options);
      }, 100);
    },
    [useWithBuyerVerification]
  );

  // <--------------------------- Card Entry ---------------------------------->

  /**
   * @deprecated Use
   * `handleCardNonceRequestSuccess` instead.
   *  now you don't need to completeCardEntry
   *  or showCardNonceProcessingError manually
   */
  const handleDeprecatedCardNonceRequestSuccess: NonceSuccessCallback = async (
    cardDetails: CardDetails
  ) => {
    try {
      if (!cardDetails.nonce || !cardDetails.card)
        throw new Error('No nonce or card found');
      await chargeService.chargeCardNonce(cardDetails.nonce);
      SQIPCardEntry.completeCardEntry(() => {
        showCommonAlert({
          title: 'Congratulation, Your order was successful',
          description:
            'Go to your Square dashboard to see this order reflected in the sales tab.',
          status: true,
        });
      });
    } catch (error: any) {
      SQIPCardEntry.showCardNonceProcessingError(
        error.message ?? 'Unknown error'
      );
    }
  };

  const handleCardNonceRequestSuccess: NonceSuccessCallbackWithResult = async (
    cardDetails: CardDetails
  ) => {
    try {
      if (!cardDetails.nonce || !cardDetails.card)
        throw new Error('No nonce or card found');
      await chargeService.chargeCardNonce(cardDetails.nonce);
      return {
        success: true,
        onCardEntryComplete: () => {
          showCommonAlert({
            title: 'Congratulation, Your order was successful',
            description:
              'Go to your Square dashboard to see this order reflected in the sales tab.',
            status: true,
          });
        },
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: String(error?.message) ?? 'Unknown error',
      };
    }
  };

  const handleCardEntryCancel = () => {
    showCommonAlert({
      title: 'Card entry canceled',
      description: 'You have cancelled the card entry.',
      status: true,
    });
  };

  const handleStartCardEntryFlow = () => {
    if (useWithBuyerVerification) {
      SQIPCardEntry.startCardEntryFlowWithBuyerVerification(
        true,
        paymentSourceId,
        cardEntryConfig,
        handleBuyerVerificationSuccess,
        handleBuyerVerificationFailure,
        handleCardNonceRequestSuccess,
        handleCardEntryCancel
      );
    } else {
      if (useDeprecatedMethods) {
        SQIPCardEntry.startCardEntryFlow(
          cardEntryConfig,
          handleDeprecatedCardNonceRequestSuccess,
          handleCardEntryCancel
        );
      } else {
        SQIPCardEntry.startCardEntryFlow(
          true,
          handleCardNonceRequestSuccess,
          handleCardEntryCancel
        );
      }
    }
  };

  const handleStartGiftCardEntryFlow = () => {
    if (useWithBuyerVerification) {
      SQIPCardEntry.startGiftCardEntryFlowWithBuyerVerification(
        paymentSourceId,
        cardEntryConfig,
        handleBuyerVerificationSuccess,
        handleBuyerVerificationFailure,
        handleCardNonceRequestSuccess,
        handleCardEntryCancel
      );
    } else {
      if (useDeprecatedMethods) {
        SQIPCardEntry.startGiftCardEntryFlow(
          handleDeprecatedCardNonceRequestSuccess,
          handleCardEntryCancel
        );
      } else {
        SQIPCardEntry.startGiftCardEntryFlow(
          handleCardNonceRequestSuccess,
          handleCardEntryCancel
        );
      }
    }
  };

  // <------------------------ Buyer Verification ----------------------------->

  const handleBuyerVerificationSuccess = (
    verificationResult: VerificationResult
  ) => {
    showToastMessage({
      title: 'Buyer verification successful',
      description: 'Token: ' + (verificationResult.token ?? 'Unknown token'),
      status: true,
    });
  };

  const handleBuyerVerificationFailure = (errorInfo: ErrorDetails) => {
    showToastMessage({
      title: 'Buyer verification failed',
      description: errorInfo.message ?? 'Unknown error',
      status: false,
    });
  };

  const handleStartBuyerVerificationFlow = () => {
    if (useDeprecatedMethods) {
      SQIPCardEntry.startBuyerVerificationFlow(
        paymentSourceId,
        cardEntryConfig,
        handleBuyerVerificationSuccess,
        handleBuyerVerificationFailure,
        () => {
          //not effective in the new method
          console.log('card entry canceled');
        }
      );
    } else {
      SQIPBuyer.startBuyerVerificationFlow(
        paymentSourceId,
        cardEntryConfig,
        handleBuyerVerificationSuccess,
        handleBuyerVerificationFailure
      );
    }
  };

  // <------------------------- Google Pay ------------------------------------>

  const handleGooglePayNonceRequestSuccess = async (
    cardDetails: CardDetails
  ) => {
    try {
      if (!cardDetails.nonce || !cardDetails.card)
        throw new Error('No nonce or card found');
      await chargeService.chargeCardNonce(cardDetails.nonce);
      showCommonAlert({
        title: 'Congratulation, Your order was successful',
        description:
          'Go to your Square dashboard to see this order reflected in the sales tab.',
        status: true,
      });
    } catch (error: any) {
      showCommonAlert({
        title: 'Error processing GooglePay payment',
        description: error.message ?? 'Unknown error',
        status: false,
      });
    }
  };

  const handleGooglePayNonceRequestFailure = (errorInfo: ErrorDetails) => {
    showCommonAlert({
      title: 'Google Pay nonce request failed',
      description: errorInfo.message ?? 'Unknown error',
      status: false,
    });
  };

  const handleGooglePayCanceled = () => {
    showCommonAlert({
      title: 'Google Pay canceled',
      description: 'You have canceled the Google Pay request.',
      status: true,
    });
  };

  const handleRequestGooglePayNonce = async () => {
    try {
      if (useWithBuyerVerification) {
        await SQIPGooglePay.requestGooglePayNonceWithBuyerVerification(
          paymentSourceId,
          cardEntryConfig,
          googlePayConfig,
          handleBuyerVerificationSuccess,
          handleBuyerVerificationFailure,
          handleGooglePayNonceRequestSuccess,
          handleGooglePayNonceRequestFailure,
          handleGooglePayCanceled
        );
      } else {
        await SQIPGooglePay.requestGooglePayNonce(
          googlePayConfig,
          handleGooglePayNonceRequestSuccess,
          handleGooglePayNonceRequestFailure,
          handleGooglePayCanceled
        );
      }
    } catch (error) {
      showCommonAlert({
        title: 'Google Pay failed',
        description: (error as Error).message ?? 'Unknown error',
        status: false,
      });
    }
  };

  // <-------------------------- Apple Pay ------------------------------------>

  /** @deprecated see handleApplePayNonceRequestSuccess
   *  now you don't need to completeApplePayAuthorization manually
   *  and don't need to manage applePayState and applePayError locally
   */
  const handleDeprecatedApplePayNonceRequestSuccess = async (
    cardDetails: CardDetails
  ) => {
    try {
      if (!cardDetails.nonce || !cardDetails.card)
        throw new Error('No nonce or card found');
      await chargeService.chargeCardNonce(cardDetails.nonce);
      SQIPApplePay.completeApplePayAuthorization(true);
      setApplePayError(null);
      setApplePayState(applePayStatus.succeeded);
    } catch (error: any) {
      SQIPApplePay.completeApplePayAuthorization(
        false,
        error.message ?? 'Unknown error'
      );
      setApplePayError(error.message ?? 'Unknown error');
      setApplePayState(applePayStatus.nonceNotCharged);
    }
  };

  /** @deprecated see handleApplePayNonceRequestFailure */
  const handleDeprecatedApplePayNonceRequestFailure = (
    errorInfo: ErrorDetails
  ) => {
    SQIPApplePay.completeApplePayAuthorization(
      false,
      errorInfo.message ?? 'Unknown error'
    );
    showCommonAlert({
      title: 'Error processing ApplePay payment',
      description: errorInfo.message ?? 'Unknown error',
      status: false,
    });
  };

  /** @deprecated see handleApplePayComplete */
  const handleDeprecatedApplePayComplete = () => {
    if (applePayState === applePayStatus.succeeded) {
      showCommonAlert({
        title: 'Congratulation, Your order was successful',
        description:
          'Go to your Square dashboard to see this order reflected in the sales tab.',
        status: true,
      });
    } else if (applePayState === applePayStatus.nonceNotCharged) {
      showCommonAlert({
        title: 'Nonce generated but not charged',
        description: applePayError ?? 'Unknown error',
        status: true,
      });
    } else {
      showCommonAlert({
        title: 'Apple Pay canceled',
        description: 'You have canceled the Apple Pay request.',
        status: true,
      });
    }
    setApplePayState(applePayStatus.none);
    setApplePayError(null);
  };

  const handleApplePayNonceRequestSuccess: ApplePayNonceSuccessCallbackWithResult =
    async (cardDetails) => {
      try {
        if (!cardDetails.nonce || !cardDetails.card)
          throw new Error('No nonce or card found');
        await chargeService.chargeCardNonce(cardDetails.nonce);
        return {
          state: ApplePayNonceSuccessState.Succeeded,
        };
      } catch (error: any) {
        return {
          state: ApplePayNonceSuccessState.Failure,
          errorMessage: String(error?.message) ?? 'Unknown error',
        };
      }
    };

  const handleApplePayNonceRequestFailure = (errorInfo: ErrorDetails) => {
    showCommonAlert({
      title: 'Error processing ApplePay payment',
      description: errorInfo.message ?? 'Unknown error',
      status: false,
    });
  };

  const handleApplePayComplete = (
    status: ApplePayNonceSuccessState,
    errorMessage: string | undefined
  ) => {
    if (status === ApplePayNonceSuccessState.Succeeded) {
      showCommonAlert({
        title: 'Congratulation, Your order was successful',
        description:
          'Go to your Square dashboard to see this order reflected in the sales tab.',
        status: true,
      });
    } else if (status === ApplePayNonceSuccessState.Failure) {
      showCommonAlert({
        title: 'Apple Pay failed',
        description: errorMessage ?? 'Unknown error',
        status: false,
      });
    } else if (status === ApplePayNonceSuccessState.Canceled) {
      showCommonAlert({
        title: 'Apple Pay canceled',
        description: 'You have canceled the Apple Pay request.',
        status: true,
      });
    }
  };

  const handleRequestApplePayNonce = async () => {
    try {
      if (useWithBuyerVerification) {
        await SQIPApplePay.requestApplePayNonceWithBuyerVerification(
          paymentSourceId,
          cardEntryConfig,
          applePayConfig,
          handleBuyerVerificationSuccess,
          handleBuyerVerificationFailure,
          handleApplePayNonceRequestSuccess,
          handleApplePayNonceRequestFailure,
          handleApplePayComplete
        );
      } else {
        if (useDeprecatedMethods) {
          await SQIPApplePay.requestApplePayNonce(
            applePayConfig,
            handleDeprecatedApplePayNonceRequestSuccess,
            handleDeprecatedApplePayNonceRequestFailure,
            handleDeprecatedApplePayComplete
          );
        } else {
          await SQIPApplePay.requestApplePayNonce(
            applePayConfig,
            handleApplePayNonceRequestSuccess,
            handleApplePayNonceRequestFailure,
            handleApplePayComplete
          );
        }
      }
    } catch (error) {
      showCommonAlert({
        title: 'Apple Pay failed',
        description: (error as Error).message ?? 'Unknown error',
        status: false,
      });
    }
  };

  return (
    <AppPage style={styles.page}>
      <View style={[styles.floatingButton, { top: top + dimensions.xl }]}>
        <AppIcon
          color={colors.onBackground}
          name="settings-outline"
          onPress={() => router.push('/settings')}
        />
      </View>
      <Image
        source={require('../../assets/images/cookie.png')}
        style={styles.image}
      />
      <AppText size="h1" weight="bold" style={styles.align}>
        Super Cookie
      </AppText>
      <AppText style={styles.align}>
        Instantly gain special powers{'\n'}when ordering a super cookie
      </AppText>
      <AppButton label="Buy" onPress={() => bottomSheetRef.current?.open()} />
      <AppToastMessage ref={appToastMessageRef} />
      <CommonAlert ref={commonAlertRef} />
      <BottomSheet ref={bottomSheetRef} title="Buy Super Cookie">
        <View style={styles.row}>
          <AppButton
            leadingIconName="card-outline"
            label="Card Pay"
            style={styles.button}
            onPress={handleStartCardEntryFlow}
          />
          <AppButton
            leadingIconName="gift-outline"
            label="Gif Card Pay"
            style={styles.button}
            onPress={handleStartGiftCardEntryFlow}
          />
        </View>
        <View style={styles.row}>
          <AppImageButton
            image={
              Platform.OS === 'ios' ? (
                <Image
                  source={require('../../assets/images/apple-pay-logo.png')}
                  resizeMode="contain"
                  style={styles.imageButton}
                />
              ) : (
                <Image
                  source={require('../../assets/images/google-pay-logo.png')}
                  resizeMode="contain"
                  style={styles.imageButton}
                />
              )
            }
            style={styles.button}
            disabled={!canUseDigitalWallet}
            onPress={() => {
              Platform.OS === 'android'
                ? handleRequestGooglePayNonce()
                : handleRequestApplePayNonce();
            }}
          />
          <AppButton
            leadingIconName="shield-checkmark-outline"
            label="Buyer Verification"
            style={styles.button}
            onPress={handleStartBuyerVerificationFlow}
          />
        </View>
      </BottomSheet>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  align: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: dimensions.md,
  },
  button: {
    flex: 1,
  },
  imageButton: {
    height: 20,
  },
  floatingButton: {
    position: 'absolute',
    top: dimensions.xl,
    right: dimensions.xl,
  },
});
