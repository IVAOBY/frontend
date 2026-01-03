import React, { Suspense, lazy } from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const Snowfall = lazy(() => import('react-snowfall'));

const isSnowfallSeason = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const start = new Date(currentYear, 11, 25);
  const end = new Date(currentYear + 1, 0, 5);

  return currentDate >= start && currentDate <= end;
};

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
