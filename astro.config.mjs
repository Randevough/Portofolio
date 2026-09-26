import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://rafifernanda.site',
  integrations: [sitemap()],
  devToolbar: {
    enabled: false,
  },
});
