/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the legacy Pages Router
  useFileSystemPublicRoutes: true,
  // Enable App Router features
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
