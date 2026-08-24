/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// GitHub Pages runs under a repo subpath (/lockpulse), whereas Vercel and local dev run at root (/)
const basePath = isGithubActions ? '/lockpulse' : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
