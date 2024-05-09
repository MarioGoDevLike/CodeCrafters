
module.exports = (api) => {
  api.cache(true);

  const plugins = [
      [
          'module-resolver',
          {
              root: ['./src'],
              extensions: [
                  '.ios.ts',
                  '.android.ts',
                  '.ts',
                  '.ios.tsx',
                  '.android.tsx',
                  '.tsx',
                  '.jsx',
                  '.js',
                  '.json',
              ],
              alias: {
                  components: './src/components',
                  services: './src/services',
                  stacks: './src/navigation/stacks',
                  views: './src/views',
                  types: './src/types',
              },
          },
      ],
      'react-native-reanimated/plugin',
  ];

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};