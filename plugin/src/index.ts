/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  IOSConfig,
  withAndroidManifest,
  withEntitlementsPlist,
} from "expo/config-plugins";

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow, removeMetaDataItemFromMainApplication } = AndroidConfig.Manifest;

const pkg = require("react-native-square-in-app-payments/package.json");

type SquarePluginProps = {
  /**
   * The iOS merchant ID used for enabling Apple Pay.
   * Without this, the error "Missing merchant identifier" will be thrown on iOS.
   */
  merchantIdentifier: string | string[];
  enableGooglePay: boolean;
};

const withSquareIos: ConfigPlugin<SquarePluginProps> = (expoConfig, { merchantIdentifier }) => {
  return withEntitlementsPlist(expoConfig, (config) => {
    config.modResults = setApplePayEntitlement(merchantIdentifier, config.modResults);
    return config;
  });
};

const withSquare: ConfigPlugin<SquarePluginProps> = (config, props) => {
  config = withSquareIos(config, props);
  config = withNoopSwiftFile(config);
  config = withSquareAndroid(config, props);
  return config;
};

/**
 * Adds the following to the entitlements:
 *
 * <key>com.apple.developer.in-app-payments</key>
 * <array>
 *	 <string>[MERCHANT_IDENTIFIER]</string>
 * </array>
 */
export function setApplePayEntitlement(merchantIdentifiers: string | string[], entitlements: Record<string, any>): Record<string, any> {
  const key = "com.apple.developer.in-app-payments";

  const merchants: string[] = entitlements[key] ?? [];

  if (!Array.isArray(merchantIdentifiers)) {
    merchantIdentifiers = [merchantIdentifiers];
  }

  for (const id of merchantIdentifiers) {
    if (id && !merchants.includes(id)) {
      merchants.push(id);
    }
  }

  if (merchants.length) {
    entitlements[key] = merchants;
  }
  return entitlements;
}

/**
 * Add a blank Swift file to the Xcode project for Swift compatibility.
 */
export const withNoopSwiftFile: ConfigPlugin = (config) => {
  return IOSConfig.XcodeProjectFile.withBuildSourceFile(config, {
    filePath: "noop-file.swift",
    contents: [
      "//",
      "// @generated",
      "// A blank Swift file must be created for native modules with Swift files to work correctly.",
      "//",
      "",
    ].join("\n"),
  });
};

const withSquareAndroid: ConfigPlugin<SquarePluginProps> = (expoConfig, { enableGooglePay = false }) => {
  return withAndroidManifest(expoConfig, (config) => {
    config.modResults = setGooglePayMetaData(enableGooglePay, config.modResults);

    return config;
  });
};

/**
 * Adds the following to AndroidManifest.xml:
 *
 * <application>
 *   ...
 *	 <meta-data
 *     android:name="com.google.android.gms.wallet.api.enabled"
 *     android:value="true|false" />
 * </application>
 */
export function setGooglePayMetaData(
  enabled: boolean,
  modResults: AndroidConfig.Manifest.AndroidManifest
): AndroidConfig.Manifest.AndroidManifest {
  const GOOGLE_PAY_META_NAME = "com.google.android.gms.wallet.api.enabled";
  const mainApplication = getMainApplicationOrThrow(modResults);
  if (enabled) {
    addMetaDataItemToMainApplication(mainApplication, GOOGLE_PAY_META_NAME, "true");
  } else {
    removeMetaDataItemFromMainApplication(mainApplication, GOOGLE_PAY_META_NAME);
  }

  return modResults;
}

export default createRunOncePlugin(withSquare, pkg.name, pkg.version);
