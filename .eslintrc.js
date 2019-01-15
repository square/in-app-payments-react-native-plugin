module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "airbnb",
        "plugin:react-native/all"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": ['.js']
            }
        },
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "env": {
        "react-native/react-native": true,
        "jest": true
    },
    "rules": {
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 2,
        "react-native/no-color-literals": 0,
        "no-use-before-define": 0,
        "react/jsx-filename-extension": 0,
        "react/destructuring-assignment": 0,
        "no-console": 0,
        "react/forbid-prop-types": 0,
        "class-methods-use-this": 0,
    }
};
