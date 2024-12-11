/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dodamdodam-storage.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
