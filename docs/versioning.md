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

1. Remove the `ios/Podfile.lock` and build your project again.
    ```bash
    cd ios
    rm Podfile.lock
    pod install
    ```

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

