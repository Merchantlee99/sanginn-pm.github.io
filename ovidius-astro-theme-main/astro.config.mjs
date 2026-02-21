import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://Merchantlee99.github.io',
    base: '/sanginn-pm.github.io',
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [mdx(), sitemap(), react()]
});