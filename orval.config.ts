import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: { target: 'https://api.by.ivao.aero/docs-json' },
    output: {
      target: './src/api/client.ts',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      clean: true,
      override: {
        mutator: {
          path: './src/utils/customInstance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
