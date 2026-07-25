import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://RandDevs.github.io',
  base: '/Portofolio',
  integrations: [sitemap()],
});
