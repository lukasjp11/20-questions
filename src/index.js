import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    
    // Check if this is localhost or production
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );
    
    if (isLocalhost) {
      // In development, just register the service worker
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful:', registration);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    } else {
      // In production, check that service worker exists
      fetch(swUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok && response.headers.get('content-type')?.includes('javascript')) {
            navigator.serviceWorker.register(swUrl)
              .then(registration => {
                console.log('ServiceWorker registration successful:', registration);
                
                // Check for updates periodically
                setInterval(() => {
                  registration.update();
                }, 60 * 60 * 1000); // Check every hour
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                  const newWorker = registration.installing;
                  newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      // New service worker available, prompt for update
                      if (window.confirm('Ny version tilgængelig! Vil du opdatere?')) {
                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                        window.location.reload();
                      }
                    }
                  });
                });
              })
              .catch(error => {
                console.error('ServiceWorker registration failed:', error);
              });
          } else {
            console.log('No valid service worker found at', swUrl);
          }
        })
        .catch(() => {
          console.log('No internet connection found. App is running in offline mode.');
        });
    }
  });
}

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  window.deferredPrompt = deferredPrompt;
});