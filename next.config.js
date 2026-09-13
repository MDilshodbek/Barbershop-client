/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
    REACT_APP_API_WS: process.env.REACT_APP_API_WS,
  },
  // Ensure assets are served correctly
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Output standalone for better Docker performance (production builds only —
  // enabling this during `next dev` on Windows causes file tracing to race
  // with HMR writes to .next/static/chunks, producing UNKNOWN open errors)
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
};

const { i18n } = require("./next-i18next.config");
nextConfig.i18n = i18n;

module.exports = nextConfig;