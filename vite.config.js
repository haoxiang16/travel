import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// 修復 PWA 路徑的插件（在 build 完成後執行）
const fixPwaPathsPlugin = () => ({
  name: 'fix-pwa-paths',
  enforce: 'post',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      // 移除 vite-plugin-pwa 自動注入的絕對路徑 manifest 連結
      return html.replace(/<link rel="manifest" href="\/manifest\.webmanifest">/g, '')
    }
  }
})

export default defineConfig({
  // GitHub Pages 部署時使用倉庫名稱作為 base
  // 本地開發時使用 '/'
  base: process.env.GITHUB_ACTIONS ? '/travel/' : '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // 禁用自動注入，手動在 index.html 處理
      injectRegister: false,
      injectManifest: false,
      devOptions: {
        enabled: true,
        type: 'module'
      },
      includeAssets: ['robots.txt', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: '台灣輕旅行',
        short_name: '輕旅行',
        description: '使用Google Map的旅遊行程規劃應用',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'google-maps-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      }
    }),
    fixPwaPathsPlugin()
  ],
  server: {
    port: 3000
  }
})

