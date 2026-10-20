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
        // Bundle the DataDome SDK (its ESM build) into the production server
        // build, so it doesn't rely on pnpm's node_modules symlinks surviving
        // deployment packaging; its CommonJS build requires 'tslib' through
        // one. Build only: the dev server can't run the inlined CommonJS build.
        name: 'bundle-datadome-sdk',
        config: (_, {command}) =>
          command === 'build'
            ? {
                ssr: {
                  noExternal: ['@datadome/fraud-sdk-node', 'tslib'],
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
