
# react-native-in-app-payments-react-native-plugin

## Getting started

`$ npm install react-native-in-app-payments-react-native-plugin --save`

### Mostly automatic installation

`$ react-native link react-native-in-app-payments-react-native-plugin`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-in-app-payments-react-native-plugin` and add `RNInAppPaymentsReactNativePlugin.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNInAppPaymentsReactNativePlugin.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNInAppPaymentsReactNativePluginPackage;` to the imports at the top of the file
  - Add `new RNInAppPaymentsReactNativePluginPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-in-app-payments-react-native-plugin'
  	project(':react-native-in-app-payments-react-native-plugin').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-in-app-payments-react-native-plugin/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-in-app-payments-react-native-plugin')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNInAppPaymentsReactNativePlugin.sln` in `node_modules/react-native-in-app-payments-react-native-plugin/windows/RNInAppPaymentsReactNativePlugin.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using In.App.Payments.React.Native.Plugin.RNInAppPaymentsReactNativePlugin;` to the usings at the top of the file
  - Add `new RNInAppPaymentsReactNativePluginPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNInAppPaymentsReactNativePlugin from 'react-native-in-app-payments-react-native-plugin';

// TODO: What to do with the module?
RNInAppPaymentsReactNativePlugin;
```
  