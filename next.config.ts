import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  htmlLimitedBots: /facebookexternalhit|Facebot|InstagramBot/i,
};

export default nextConfig;
