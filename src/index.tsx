import React from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';

import Snowfall from 'react-snowfall';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

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
    {isSnowfallSeason() && <Snowfall color={'#D7D7DC'} />}
  </React.StrictMode>,
);
reportWebVitals();
