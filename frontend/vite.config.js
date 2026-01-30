import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // يسمح بالاتصال من أي عنوان IP
    port: 5186,        // نفس البورت الذي يستخدمه Vite
    strictPort: false, // يسمح بتغيير البورت تلقائيًا إذا كان مستخدم
    allowExternal: true, // السماح لأي host خارجي
    cors: true           // تفعيل الوصول من أي مصدر
  }
})

