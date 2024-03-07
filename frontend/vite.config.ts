import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import { join } from 'path'
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer() as unknown as postcss.AcceptedPlugin],
    },
  },
  resolve: {  
    alias: {
      '@': join(__dirname, "src"),
      '~': join(__dirname, "wailsjs"),
      '@img': join(__dirname, "src/assets"),
      '@util': join(__dirname, "src/utils"),
      '@dict': join(__dirname, "src/dicts")
    }
  },
  plugins: [react({
    babel: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
      ],
    },
  })]
})
