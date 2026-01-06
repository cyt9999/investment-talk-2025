import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 新增這一行，填入你的 GitHub 儲存庫名稱，前後都要有斜線
  base: '/investment-talk-2025/',
})
