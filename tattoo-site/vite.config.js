import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Faz a rota /galeria servir o galeria.html, mantendo a URL limpa (sem .html).
function galeriaRoute() {
  const rewrite = (req) => {
    const [path, query] = (req.url || '').split('?');
    if (path === '/galeria' || path === '/galeria/') {
      req.url = '/galeria.html' + (query ? `?${query}` : '');
    }
  };

  return {
    name: 'galeria-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        rewrite(req);
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [galeriaRoute()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        galeria: resolve(import.meta.dirname, 'galeria.html'),
      },
    },
  },
});
