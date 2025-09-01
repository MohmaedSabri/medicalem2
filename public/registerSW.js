// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Only register service worker in production
if (!isDevelopment && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // SW registered successfully
      })
      .catch((registrationError) => {
        // SW registration failed
      });
  });
} else if (navigator.serviceWorker) {
  // Service Worker disabled in development mode
}

// Add to home screen functionality
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button if you have one
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

// Handle successful installation
window.addEventListener('appinstalled', (evt) => {
  // PWA was installed
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
});
