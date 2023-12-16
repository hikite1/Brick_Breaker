//orchetrates rendering of components local and server
//main structure

import React from 'react';
import Canvas from './Canvas'; //imports canvas component
import './App.css'; //imports CSS to be used with rendering the App component

function App() {
  return ( //begins rendering the structure of the application
    <div className="App">
      <h1>Block Breaker Game</h1>
      <Canvas /> 
    </div>
  );
}

export default App; //exoirts app component as default, other files can import and use

