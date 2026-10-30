/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/api/generate-shirt": ["./public/clothes/**/*.png"],
  },
};

export default nextConfig;
