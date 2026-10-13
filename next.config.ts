import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kunci root proyek ke folder ini supaya Next tidak salah memilih package-lock.json di folder induk.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
