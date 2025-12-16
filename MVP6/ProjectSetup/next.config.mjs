/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude DFINITY packages from server bundle (client-only)
      config.externals = config.externals || [];
      config.externals.push({
        '@dfinity/auth-client': 'commonjs @dfinity/auth-client',
        '@dfinity/agent': 'commonjs @dfinity/agent',
        '@dfinity/principal': 'commonjs @dfinity/principal',
        '@dfinity/candid': 'commonjs @dfinity/candid',
      });
    }
    return config;
  },
}

export default nextConfig
