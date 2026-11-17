import React, { lazy, Suspense } from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const Snowfall = lazy(() => import('react-snowfall'));

const isSnowfallSeason = () => {
  const now = new Date();
  const m = now.getMonth();
  const d = now.getDate();

  return (
    (m === 11 && d >= 25) || // 25–31 декабря
    (m === 0 && d <= 5) // 1–5 января
  );
};

const enableApiMocks = async () => {
  if (import.meta.env.VITE_API_MOCK !== 'true') return;
  const { startMockWorker } = await import('./mocks/browser');
  await startMockWorker();
};

void enableApiMocks().then(() => {
  root.render(
    <React.StrictMode>
      <App />
      {isSnowfallSeason() && (
        <Suspense fallback={null}>
          <Snowfall color="#D7D7DC" />
        </Suspense>
      )}
    </React.StrictMode>,
  );
  reportWebVitals();
});
