import React, { useState, useEffect } from 'react';

import NavBar from './NavBar';

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
      <h1>Hello, World!</h1>
      <h2>{ message }</h2>
    </div>
  );
}

export default App;