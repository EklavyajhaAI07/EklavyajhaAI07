// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://eklavya.dpdns.org',
  trailingSlash: 'always',
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    sitemap({
      // Only index the 4 main pages — exclude reel-mode URLs and 404
      filter: (page) =>
        !page.includes('?reel') && !page.includes('404'),
    }),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['gsap'],
    },
  },
});

