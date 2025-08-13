/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Exclude svg from default file loader
    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test && rule.test.test('.svg'));
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    // Add SVGR for SVGs
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        { loader: '@svgr/webpack', options: { icon: false } },
      ],
    });
    return config;
  },
  experimental: { appDir: true },
};
module.exports = nextConfig;
