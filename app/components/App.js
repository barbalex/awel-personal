// @flow
import React, { Fragment } from 'react';

import DbContext from '../db-context';

const App = () => (
  <DbContext>
    {db => {
      const geschaefte = db
        .prepare('SELECT idGeschaeft from geschaefte limit 1')
        .get();

      return (
        <Fragment>
          <div>{`id: ${geschaefte.idGeschaeft}`}</div>
          <div>Hello world</div>
        </Fragment>
      );
    }}
  </DbContext>
);

export default App;
