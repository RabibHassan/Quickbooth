import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Make sure you have these packages installed:
// npm install @vitejs/plugin-react --save-dev
// npm install @types/react --save-dev
// npm install @types/node --save-dev

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
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
