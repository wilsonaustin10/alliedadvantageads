/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the legacy Pages Router
  useFileSystemPublicRoutes: true,
  // No need for experimental.appDir in Next.js 14+ as it's the default
};

module.exports = nextConfig;
