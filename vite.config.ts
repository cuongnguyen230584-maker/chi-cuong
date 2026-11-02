import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Không nhúng GEMINI_API_KEY vào mã trình duyệt: khóa chỉ được đọc trong server.ts.
export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
