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


## I get thre Error ":CFBundleIdentifier", Does Not Exist

### The problem

Your iOS configuration files are missing or not correctly configured.

### Solution

There is a [stackoverflow question](https://stackoverflow.com/questions/37461703/print-entry-cfbundleidentifier-does-not-exist) that adresses this problem.
