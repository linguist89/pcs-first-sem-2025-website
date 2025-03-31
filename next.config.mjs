/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        'react-syntax-highlighter/dist/esm/styles/prism/coy'
      ];
    }
    return config;
  },
};

export default nextConfig;
