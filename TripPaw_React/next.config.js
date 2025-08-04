const withTM = require('next-transpile-modules')([
  '@rc-component/util',
  'rc-util',
  'rc-picker',
  'rc-table',
  'rc-tree',
  '@ant-design/icons',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/hooks/useState': require.resolve('rc-util/es/hooks/useState'),
    };

    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules[\\/](?:@ant-design[\\/]icons|rc-util|rc-picker|rc-table|rc-tree)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });

    config.resolve.extensions.push('.js');
    return config;
  },
};

module.exports = withTM(nextConfig);
