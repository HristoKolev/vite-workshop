import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
  },
  server: {
    cors: true,
    port: 3000,
    strictPort: true,
    host: true,
  },
  preview: {
    cors: true,
    port: 3000,
    strictPort: true,
    host: true,
  },
});
