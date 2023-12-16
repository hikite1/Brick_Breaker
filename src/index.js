//Brick Breaker game 
//Keith Jackson

//Entry point
// interacts with the DOM and renders App compnent 

import React from 'react'; //imports React library
import ReactDOM from 'react-dom/client'; //imports ReactDOM object from library
import App from './App'; //imports App component 

//React concurrent mode API, ReactDOM root instance container for rendering React components
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( //initiates rendering process
//alerts - development mode feature for mistakes in components
  <React.StrictMode>
    <App />
  </React.StrictMode>
);