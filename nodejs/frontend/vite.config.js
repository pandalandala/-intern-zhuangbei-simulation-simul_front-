import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

import svgLoader from 'vite-svg-loader'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    // 项目插件
    plugins: [
      vue(),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 1025,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    // 基础配置
    base: './',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue': 'vue/dist/vue.esm-bundler.js',
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            '@border-color-base': '#dce3e8',
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      brotliSize: false,
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除console及debug
          drop_console: false,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        `monaco-editor/esm/vs/language/json/json.worker`,
        `monaco-editor/esm/vs/language/css/css.worker`,
        `monaco-editor/esm/vs/language/html/html.worker`,
        `monaco-editor/esm/vs/language/typescript/ts.worker`,
        `monaco-editor/esm/vs/editor/editor.worker`
      ], 
    },
  }
})


