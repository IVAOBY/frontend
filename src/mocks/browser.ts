import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';
import { applyProfileFromUrl } from './session';

export const startMockWorker = () => {
  applyProfileFromUrl();

  return setupWorker(...handlers).start({
    onUnhandledFrame: 'bypass',
    quiet: true,
  });
};
