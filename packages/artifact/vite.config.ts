import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';
export default defineConfig({
    plugins: [UnoCSS({}), solid(), dts()],
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/artifacts/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['solid-js', 'comlink', 'prismjs'],
        },
    },
});
