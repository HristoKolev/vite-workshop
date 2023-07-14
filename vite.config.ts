import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
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
    exclude: [...configDefaults.exclude, 'extra'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      all: true,
      include: ['**/src/**'],
      exclude: [
        ...(configDefaults.coverage.exclude || []),
        'extra',
        'src/main.tsx',
      ],
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 90,
    },
  },
});
