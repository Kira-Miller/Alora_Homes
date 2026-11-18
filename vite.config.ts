import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      // Copies static folders (data, assets, css) into dist/ so both
      // raw GitHub Pages and Vite dist builds resolve all relative paths.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          if (!fs.existsSync(distDir)) return;
          for (const folder of ['data', 'assets', 'css']) {
            const srcFolder = path.resolve(__dirname, folder);
            const destFolder = path.resolve(distDir, folder);
            if (fs.existsSync(srcFolder)) {
              fs.cpSync(srcFolder, destFolder, {recursive: true, force: true});
            }
          }
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          catalog: path.resolve(__dirname, 'catalog.html'),
          property: path.resolve(__dirname, 'property.html'),
          sell: path.resolve(__dirname, 'sell.html'),
          cabinet: path.resolve(__dirname, 'cabinet.html'),
          about: path.resolve(__dirname, 'about.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
