/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Exclude the brainchild folder from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/brainchild/**', '**/node_modules/**'],
    };
    return config;
  },
};

export default nextConfig;