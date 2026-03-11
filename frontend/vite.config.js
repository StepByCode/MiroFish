import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

function resolveAllowedHosts(env) {
  const rawHosts = env.VITE_ALLOWED_HOSTS?.trim()

  if (!rawHosts || rawHosts.toLowerCase() === 'all') {
    return true
  }

  return rawHosts
    .split(',')
    .map(host => host.trim())
    .filter(Boolean)
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_PORT || 3000)

  return {
    plugins: [vue()],
    server: {
      host: true,
      port: Number.isFinite(port) ? port : 3000,
      open: false,
      allowedHosts: resolveAllowedHosts(env),
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:5001',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
