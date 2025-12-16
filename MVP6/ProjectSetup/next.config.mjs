/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Increase worker pool timeout
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config, { isServer }) => {
    // Disable webpack caching to prevent build issues
    config.cache = false;

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
