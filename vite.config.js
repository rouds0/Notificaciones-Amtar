import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import env from './env-config';
// https://vitejs.dev/config/
export default defineConfig({
  base:"/",
  plugins: [
    react(),
  ],
  define: {
    'process.env': JSON.stringify(env),
  },
 
})