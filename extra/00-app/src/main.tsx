import { createRoot } from 'react-dom/client';

import { App } from './App';

import './index.css';

const rootElement = document.getElementById('root') as Element;

createRoot(rootElement).render(<App />);
