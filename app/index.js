import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Database from 'better-sqlite3';
import 'bootstrap/dist/css/bootstrap.css';

import App from './components/App';
import DbContext from './db-context';

const db = new Database('C:/Users/alexa/kapla.db');

render(
  <AppContainer>
    <DbContext.Provider value={db}>
      <App />
    </DbContext.Provider>
  </AppContainer>,
  document.getElementById('root')
);
