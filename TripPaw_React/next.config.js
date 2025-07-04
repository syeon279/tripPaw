/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@rc-component/util', 'rc-util'],
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/hooks/useState': require.resolve('rc-util/es/hooks/useState'),
    };
    
    return config;
  },
};

module.exports = nextConfig;
