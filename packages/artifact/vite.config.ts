import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
    plugins: [
        UnoCSS({
            // mode: 'shadow-dom',
            // content: {
            //     filesystem: ['src/**/*.tsx'],
            // },
        }),
        solid(),
    ],
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/artifacts/index.ts',
            formats: ['es'],
            fileName: 'index',
        },
        rollupOptions: {
            external: ['solid-js', 'solid-js/web', 'comlink', 'prismjs'],
        },
    },
});
