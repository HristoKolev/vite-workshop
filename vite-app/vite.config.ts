import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      all: true,
      include: ['**/src/**'],
      exclude: [...configDefaults.coverage.exclude, 'src/main.tsx'],
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 90,
    },
  },
});
