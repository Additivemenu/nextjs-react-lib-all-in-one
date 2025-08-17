/** @type {import('next').NextConfig} */
const nextConfig = {
  //Permits Next.js Image component to load images from i.pravatar.cc
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
