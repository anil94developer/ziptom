module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    // Only include reanimated plugin if installed
    // 'react-native-reanimated/plugin', // 👈 always last (uncomment if you install react-native-reanimated)
  ],
};
