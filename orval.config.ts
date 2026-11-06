import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: { target: 'https://api.by.ivao.aero/docs-json' },
    output: {
      target: './src/api/client.ts',
      schemas: './src/api/model',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './src/api/mutator/customInstance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
