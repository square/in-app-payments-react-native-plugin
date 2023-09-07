# Override the Native In-App Payments SDK Dependency Version

The React Native Plugin for In-App Payments SDK by default loads a specific version of iOS and Android
In-App Payments SDK. 

You can override the default In-App Payments SDK versions by following this guidance.

## iOS

1. Open the `ios/Podfile` file, add the `$sqipVersion` variable and specify your desired version.

    ```ruby
    # Uncomment this line to define a global platform for your project
    platform :ios, '12.0'

    # specify the version of SquareInAppPaymentsSDK
    $sqipVersion = '1.7.1'
    ```

2. Remove the `ios/Podfile.lock` and build your project again.
    ```bash
    cd ios
    rm Podfile.lock
    pod install
    ```
3. Add build phase to setup the SquareInAppPaymentsSDK and/or SquareBuyerVerificationSDK framework
    After adding the framework using any of the above methods, follow the below instructions to complete the setup.

    On your application targets’ Build Phases settings tab, click the + icon and choose New Run Script Phase. Create a Run Script in which you specify your shell (ex: /bin/sh), add the following contents to the script area below the shell:
    ```bash
    FRAMEWORKS="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}"
    "${FRAMEWORKS}/SquareInAppPaymentsSDK.framework/setup"
    ```

Note : If you are using SquareBuyerVerificationSDK earlier than version 1.6.2 for iOS, please upgrade to 1.6.2 so that the SDK can process 3DS-enabled payments. The SDK will decline 3DS-enabled payments made after March 31, 2023 if the SDK version is earlier than 1.6.2.


## Android

1. Open the `android/build.gradle` file, add the `sqipVersion` variable and specify your desired version.
    ```gradle
    allprojects {
        repositories {
            google()
            jcenter()
        }
    }

    // add the override here
    ext {
        sqipVersion = '1.7.1'
    }
    ```

