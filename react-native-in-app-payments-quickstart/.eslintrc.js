module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: [
    'airbnb',
    'plugin:react-native/all',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', './'],
        paths: ['node_modules', 'src']
      },
    },
  },
  plugins: [
    'react',
    'react-native',
  ],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 0,
    'no-use-before-define': 0,
    'react/jsx-filename-extension': 0,
    'react/destructuring-assignment': 0,
    'no-console': 0,
    'react/forbid-prop-types': 0,
    'class-methods-use-this': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'import/no-unresolved': 2,
  },
};
