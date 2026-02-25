import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 🔹 Important : base doit correspondre au nom de ton dépôt GitHub
export default defineConfig({
  plugins: [vue()],
  base: '/monprijet/'  // ✅ Change 'Monprijet' par le nom exact de ton dépôt
})
