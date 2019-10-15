# Troubleshooting the In-App Payments SDK React Native Plugin

Likely causes and solutions for common problems.

## I get bundling error when running quick start example

### The problem

When you run the quick start example, the app launched and started loading javascript from bundling server.
This bundling error **"tries to require `react-native`, but there are several files providing this module."** is thrown.

### Likely cause

The quick start example links to the local in-app payments plugin, if the local plugin has a `node_modules` folder nested,
package resolver will look into it and cause this ambiguous resolution error.

### Solution

1. Remove the nested `node_modules`

    ```bash
    cd /PATH/TO/LOCAL/react-native-in-app-payments-quickstart
    rm -rf node_modules/react-native-square-in-app-payments/node_modules/
    ```

1. Restart the bundling server and run the app again.

---


## Card Entry UI won't close when I hot reload the app

### The problem

You open your app and launch the card entry UI, then you reload the app by "cmd+R" (iOS) or "R+R" (Android), clicking "cancel" doesn't close the card entry.

### Likely cause

The hot reload doesn't work well with card entry UI.

### Solution

You have to kill the app and launch the app again.
To prevent this from happening, please always close the card entry UI before reloading.

---


## I get Xcode compile errors when building In-App Payments SDK

### The problem

You are building your React Native project with Xcode instead of the React Native
command line interface (CLI) and using Xcode 10. Xcode 10 builds projects
differently than earlier versions.

### Likely cause

You recently downloaded or updated Xcode.

### Solution

There are 2 ways to address the issue:

1. Build with the React Native CLI instead of Xcode.

**OR**

2. Configure Xcode to use the legacy build system:
    1. Open `File > Project Settings... > Per-User Project Settings`
    2. Choose `Legacy Build System`
    3. Run `react-native clean` from the command line.

---


## I get thre Error ":CFBundleIdentifier", Does Not Exist

### The problem

Your IOS configuration files are missing or not correctly configured.

### Solution

There is a stackoverflow question that adresses this problem:

https://stackoverflow.com/questions/37461703/print-entry-cfbundleidentifier-does-not-exist.
