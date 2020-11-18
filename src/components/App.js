import React, { useState, useEffect } from 'react';

import { BrowserRouter as Route, Switch } from "react-router-dom";

import NavBar from './NavBar';
import Products from './Products';

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
    <div className="App">
      <NavBar />
      <switch>
      <Route exact path="/products">
      <Products />
      </Route>
      <h1>Hello, World!</h1>
      <h2>{ message }</h2>
      </switch>
    </div>
  );
}

export default App;