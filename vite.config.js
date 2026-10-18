import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2020',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf')) return 'vendor-pdf';
            if (id.includes('docx')) return 'vendor-docx';
            if (id.includes('html2canvas')) return 'vendor-canvas';
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 4173
  }
});
