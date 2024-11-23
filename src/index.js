import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import { UIProvider } from './context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UIProvider>
    <App />
    </UIProvider>



);