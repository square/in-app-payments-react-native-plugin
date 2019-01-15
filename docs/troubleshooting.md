# Troubleshooting the In-App Payments SDK React Native Plugin

Likely causes and solutions for common problems.

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
