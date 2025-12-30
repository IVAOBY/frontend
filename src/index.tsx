import React from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';

import Snowfall from 'react-snowfall';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const isSnowfallSeason = () => {
  const now = new Date();
  const m = now.getMonth();
  const d = now.getDate();

  return (
    (m === 11 && d >= 25) || // 25–31 декабря
    (m === 0 && d <= 5)      // 1–5 января
  );
};

root.render(
  <React.StrictMode>
    <App />
    {isSnowfallSeason() && <Snowfall color={'#D7D7DC'} />}
  </React.StrictMode>,
);
reportWebVitals();
