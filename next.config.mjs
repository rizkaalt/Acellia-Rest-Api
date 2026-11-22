/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@coflyn/scrapr", "cheerio", "axios"],
  },
};
export default nextConfig;
