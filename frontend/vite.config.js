import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server runs on port 3000 as agreed by the team.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
