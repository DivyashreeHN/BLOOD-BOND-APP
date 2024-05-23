import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
// import { ThemeProvider } from 'react-bootstrap';

const store = configureStore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      {/* <ThemeProvider> */}
        <App />
      {/* </ThemeProvider> */}
    </Provider>
  </BrowserRouter>
);
