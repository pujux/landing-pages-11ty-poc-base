import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import * as fg from 'fast-glob';
import { resolve } from 'path';

const destructPath = (file) => {
  const cleanFilePath = file.split('site/')[1].split('/').splice(1).join('');

  const fileKey =
    cleanFilePath === 'index.html'
      ? cleanFilePath.replace('.html', '')
      : cleanFilePath.replace('index.html', '');

  return [fileKey, file];
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), '');

    // these are all entry files for vite
    const files = fg.sync('**/*.html', {
      cwd: process.env.ROOT,
      absolute: true,
    });

    return {
      plugins: [
        svelte({ configFile: '../../svelte.config.js' }),
        /**
         * Sentry Vite Plugin Configuration according to Sentry doc: https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/
         */
        sentryVitePlugin({
          org: "lean-coders-gmbh",
          project: "lamie-a1-travelinsurance",

          // Specify the directory containing build artifacts
          include: process.env.DIST, // TODO: Change this to the correct path; currently set manually via CLI, but needs to be available here. use cross-env?

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and need `project:releases` and `org:read` scopes
          authToken: process.env.SENTRY_AUTH_TOKEN,

          // Optionally uncomment the line below to override automatic release name detection
          // release: process.env.RELEASE,
        }),
      ],
      base: env.BASE_URL || '/',
      root: process.env.ROOT,
      build: {
        publicDir: '../public',
        outDir: process.env.DIST,
        sourcemap: true,
        rollupOptions: {
          input: {
            main: resolve(process.env.ROOT, 'index.html'),
            ...Object.fromEntries(files.map((file) => destructPath(file))),
          },
        },
      },
    };
  } else {
    return {
      plugins: [svelte({ configFile: '../svelte.config.js' })],
      root: './site',
      server: {
        proxy: {
          '/auth': {
            target: 'https://staging.lamie.systems',
            secure: false,
            changeOrigin: true,
          },
          '/policy': {
            target: 'https://staging.lamie.systems',
            secure: false,
            changeOrigin: true,
          },
          '/travel': {
            target: 'https://staging.lamie.systems',
            secure: false,
            changeOrigin: true,
          },
          '/insure': {
            target: 'https://staging-api.lamie.insure',
            secure: false,
            changeOrigin: true,
          },
        },
      },
    };
  }
});
