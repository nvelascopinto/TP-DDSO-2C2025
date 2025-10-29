import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; 


export default defineConfig({
  server: {
    port: 3002,
    host: '0.0.0.0'
  },
  plugins: [react(), svgr()]
});
