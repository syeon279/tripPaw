const withTM = require('next-transpile-modules')([
  '@rc-component/util',
  'rc-util',
  'rc-picker',
  'rc-table',
  'rc-tree',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/hooks/useState': require.resolve('rc-util/es/hooks/useState'),
    };
    config.resolve.extensions.push('.js');
    return config;
  },
};

module.exports = withTM(nextConfig);
