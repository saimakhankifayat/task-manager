import tailwindcss from '@tailwindcss/vite'

/**
 * Inline script that applies the stored (or system) colour scheme before the
 * first paint. This avoids a flash of the wrong theme and never runs on the server.
 */
const themeInitScript = `(function(){try{var p=localStorage.getItem('taskflow_theme');var dark=p==='dark'||((p===null||p==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark)}catch(e){}})();`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Taskflow',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Taskflow is a calm, local-first task manager for planning your day with clarity.',
        },
        { name: 'theme-color', content: '#1C2E4A' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [{ innerHTML: themeInitScript, tagPosition: 'head' }],
    },
  },
  vite: {
    // Official Tailwind CSS 4 Vite integration.
    plugins: [tailwindcss()],
  },
  typescript: {
    typeCheck: false,
  },
})
