import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/static",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://quickbooth-2-4lux.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
