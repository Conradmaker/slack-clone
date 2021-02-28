import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '@layouts/App';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app')
);
