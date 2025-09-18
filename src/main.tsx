import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Vercel Web Analytics - inject tracking script on client
if (typeof window !== 'undefined') {
  try {
    // Import dynamically so SSR/build won't break if package missing during dev until installed
    import('@vercel/analytics').then((mod) => {
      mod.inject();
    }).catch((e) => {
      // ignore if not installed yet
      // console.warn('Vercel analytics not available', e);
    });
  } catch (e) {
    // noop
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
