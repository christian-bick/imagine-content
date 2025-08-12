// vite.config.js
import { resolve, relative, extname } from 'path';
import { defineConfig } from 'vite';
import { globSync } from 'glob';
import { fileURLToPath } from 'node:url';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    // ✨ Set the project's root to the 'src' directory
    root: 'src',
    publicDir: '../public',
    build: {
        // ✨ Output files to a 'dist' directory at the project level (../)
        outDir: '../dist',
        emptyOutDir: true, // This is a good practice
        rollupOptions: {
            input: Object.fromEntries(
                // ✨ Find all HTML files within the new root ('src')
                                globSync('./src/**/*.{html,js,ts,css,scss}').map(file => [
                    // ✨ The key is now naturally relative to 'src'
                    // e.g., 'pages/about.html' -> 'pages/about'
                    // e.g., 'index.html' -> 'index'
                    relative(
                        'src',
                        file.slice(0, file.length - extname(file).length)
                    ),
                    // The value is the absolute path to the file
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
        },
    },
    plugins: [
        handlebars({
            // Point to the directory where your partials are located
            partialDirectory: resolve(__dirname, './src/partials'),
        }),
    ],
});