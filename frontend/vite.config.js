import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/"
 
});


// due to deployment removed this code, this is for devlopment.
//  server: {
//     proxy: {
//       "/api": {
//        target: "http://localhost:5000",
//         changeOrigin: true,

//         rewrite: (path) => path.replace(/^\/api/, ""),
//       },
//     },
//   },


// rewrite: (path) => path.replace(/^\/api/, ""),
//  secure: false,