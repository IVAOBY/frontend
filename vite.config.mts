import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
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

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [react(), viteTsconfigPaths(), buildCommitMarker()],
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000
        port: 3310,
	allowedHosts: ["dev.ivao.aero"],
    },
});
