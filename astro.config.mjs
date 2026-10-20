import {defineConfig} from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        // Bundle these into the production server build: on Vercel, the pnpm
        // symlink that lets the DataDome SDK require('tslib') is missing at
        // runtime. Build only, since the dev server can't run the SDK's
        // CommonJS code when it's inlined.
        name: 'bundle-server-sdks',
        config: (_, {command}) =>
          command === 'build'
            ? {
                ssr: {
                  noExternal: [
                    '@datadome/fraud-sdk-node',
                    '@vercel/functions',
                    'tslib',
                  ],
                },
              }
            : undefined,
      },
    ],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
