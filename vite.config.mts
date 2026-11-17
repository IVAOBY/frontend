import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';

import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// Маркер сборки: короткий хэш коммита попадает в собранный JS. По нему
// health-check деплоя отличает новую сборку от старой — в ответе статики
// нет версии, а SPA-fallback на путь build-info.json отдаёт index.html
// вместо JSON-маркера. Хэш задаёт scripts/deploy.sh (COMMIT_HASH).
const buildCommit = process.env.COMMIT_HASH || 'dev';
const buildCommitMarker = () => ({
    name: 'build-commit-marker',
    generateBundle(_options: unknown, bundle: Record<string, {type: string; code?: string}>) {
        for (const file of Object.values(bundle)) {
            if (file.type === 'chunk' && file.code) {
                file.code = `/* build: ${buildCommit} */\n${file.code}`;
            }
        }
    },
});

// Имя файла ассета включает коммит. Content-hash считается до вставки
// маркера, поэтому две сборки одного и того же дерева делят один URL
// (assets/index-<hash>.js) — и кэш CDN продолжает отдавать старый бандл
// под тем же именем, хотя на диске уже новая сборка. С коммитом в имени
// каждый деплой получает уникальный URL: кеш промахивается, клиент
// получает свежий бандл, а имя всегда согласовано с маркером.
// Суффикс остаётся в [A-Za-z0-9_-]: scripts/deploy.sh ищет ассет как
// /assets/index-[A-Za-z0-9_-]*\.js.
const assetNamePattern = '[name]-[hash]-' + buildCommit;

// Service worker MSW отдаётся только dev-сервером, чтобы не класть его в public/ и не тащить в прод.
const mswWorkerPath = createRequire(import.meta.url).resolve('msw/mockServiceWorker.js');
const mswWorker = (): Plugin => ({
    name: 'msw-worker',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/mockServiceWorker.js', (_req, res) => {
            res.setHeader('Content-Type', 'application/javascript');
            res.end(readFileSync(mswWorkerPath));
        });
    },
});

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [react(), viteTsconfigPaths(), buildCommitMarker(), mswWorker()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/${assetNamePattern}.js`,
                chunkFileNames: `assets/${assetNamePattern}.js`,
                assetFileNames: `assets/${assetNamePattern}[extname]`,
            },
        },
    },
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000
        port: 3310,
	allowedHosts: ["dev.ivao.aero"],
    },
});
