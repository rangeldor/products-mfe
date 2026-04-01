import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'products',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/features/products/components/ProductList.tsx',
        './ProductCard': './src/features/products/components/ProductCard.tsx',
        './ProductDetail': './src/features/products/components/ProductDetail.tsx',
        './ProductsPage': './src/features/products/pages/ProductsPage.tsx',
        './ProductDetailPage': './src/features/products/pages/ProductDetailPage.tsx',
      },
      remotes: {
        auth: 'auth@http://localhost:3005/remoteEntry.js',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
