/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [];
  },
  env: {
    PORT: 3000
  }
};

export default nextConfig;
