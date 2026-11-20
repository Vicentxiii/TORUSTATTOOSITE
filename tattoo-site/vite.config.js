import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Rotas limpas: servem os .html sem a extensão na URL (dev e preview).
// Aceita também a versão com acentos/maiúsculas de /Informações-do-cliente.
function cleanRoutes() {
  const rewrite = (req) => {
    const [rawPath, query] = (req.url || '').split('?');
    let path = rawPath;
    try {
      path = decodeURIComponent(rawPath);
    } catch {
      // Mantém o caminho original se não for uma URL codificada válida.
    }

    const slug = path
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\/$/, '');
    const suffix = query ? `?${query}` : '';

    if (slug === '/galeria') {
      req.url = '/galeria.html' + suffix;
    } else if (slug === '/informacoes-do-cliente') {
      req.url = '/informacoes-do-cliente.html' + suffix;
    } else if (slug === '/significados') {
      req.url = '/significados.html' + suffix;
    }
  };

  return {
    name: 'clean-routes',
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
  plugins: [cleanRoutes()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        galeria: resolve(import.meta.dirname, 'galeria.html'),
        'informacoes-do-cliente': resolve(import.meta.dirname, 'informacoes-do-cliente.html'),
        significados: resolve(import.meta.dirname, 'significados.html'),
      },
    },
  },
});
