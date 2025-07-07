const withTM = require('next-transpile-modules')([
  '@rc-component/util',
  'rc-util',
  'rc-picker',
  'rc-table',
  'rc-tree', // ← 새로 추가
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/hooks/useState': require.resolve('rc-util/es/hooks/useState'),
    };

    // 확장자 누락 문제 해결
    config.resolve.extensions.push('.js');

    return config;
  },
};

module.exports = withTM(nextConfig);
