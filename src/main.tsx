import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import './main.css';
import './styles.scss';

const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
