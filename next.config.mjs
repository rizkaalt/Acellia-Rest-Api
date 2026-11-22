/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@coflyn/scrapr",
      "cheerio",
      "axios",
      "playwright",
      "playwright-extra",
      "puppeteer-core",
      "puppeteer-extra-plugin-stealth",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const prev = config.externals ?? [];
      config.externals = [
        ...(Array.isArray(prev) ? prev : [prev]),
        ({ request }, callback) => {
          if (
            request &&
            /^(@coflyn\/scrapr|playwright|playwright-extra|puppeteer-core|puppeteer-extra-plugin-stealth)/.test(request)
          ) {
            return callback(null, "commonjs " + request);
          }
          callback();
        },
      ];
    }
    return config;
  },
};
export default nextConfig;
