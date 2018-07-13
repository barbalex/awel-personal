import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Database from 'better-sqlite3';

import App from './components/App';

const db = new Database('C:/Users/alexa/kapla.db');
const geschaefte = db
  .prepare('SELECT idGeschaeft from geschaefte limit 1')
  .get();
console.log('geschaefte', geschaefte);

render(
  <AppContainer>
    <div>
      <div>{`id: ${geschaefte.idGeschaeft}`}</div>
      <App />
    </div>
  </AppContainer>,
  document.getElementById('root')
);
