module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // retainLines: true,
    compact: false,
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
            src: './src',
            assets: './assets',
            components: './src/components',
            '@redux': './src/redux',
            utility: './src/utility',
            config: './src/config',
            routes: './src/routes',
            navigation: './src/navigation',
            screens: './src/screens',
            hooks: './src/hooks',
            core: './src/core',
            extensions: './src/extensions',
            scripts: './src/scripts',
            contexts: './src/contexts',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
    // env: {
    //   development: {
    //     plugins: ['inline-dotenv', '@babel/plugin-proposal-optional-chaining'],
    //   },
    // },
  };
};
