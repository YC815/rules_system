import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler 走 Babel，dev 編譯會明顯變慢且吃滿 CPU。
  // 它是執行期 render 優化，只在 production build 啟用即可。
  reactCompiler: process.env.NODE_ENV === "production",
};

export default nextConfig;
