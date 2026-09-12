import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@umbercore/ui",
    "@umbercore/leads",
    "@umbercore/email",
  ],
};

export default nextConfig;
