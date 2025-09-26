/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  env: {
    PORT: "3000"
  }
};

export default nextConfig;