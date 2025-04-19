import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  //for relative paths using nginx
  // server:
  //   mode === "development"
  //     ? {
  //         proxy: {
  //           "/api": {
  //             target: "http://localhost:5000", // Your local backend
  //             changeOrigin: true,
  //           },
  //         },
  //       }
  //     : {},
}));
