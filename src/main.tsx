/**
 * @file main.tsx
 * @description React 19 entry point mounting the AgriWing client application into DOM root.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root DOM element #root not found. Unable to mount AgriWing application.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
