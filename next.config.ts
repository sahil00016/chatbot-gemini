/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ignore test files during build
    config.module.rules.push({
      test: /\.(test|spec)\.(ts|tsx)$/,
      loader: 'ignore-loader',
    });
    return config;
  },
  // Ensure only page-related files are processed
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;