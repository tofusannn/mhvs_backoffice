/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["public.aorsortor.online"],
  },
  output: "standalone",
};

module.exports = nextConfig;
