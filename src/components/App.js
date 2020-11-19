import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import {
  Product
} from './index';

import {
  getSomething
} from '../api';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSomething()
      .then(response => {
        setMessage(response.message);
      })
      .catch(error => {
        setMessage(error.message);
      });
  });

  return (
    <Router>
      <h1>Hello, World!</h1>
      <h2>{ message }</h2>
      <div className="App">
        <Switch>
          <Route path="/product/:productId">
              <Product />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;