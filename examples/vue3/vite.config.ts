import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                // example of importing Vant
                componentName => {
                    // where `componentName` is always CapitalCase
                    if (componentName.startsWith('Icon')) return { name: componentName.slice(4), from: '@icon-space/vue-next' }
                }
            ]
        })
    ]
})
