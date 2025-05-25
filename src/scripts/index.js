// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import CONFIG from './config';
import AuthStore from './data/auth-store';
import StoryApi from './data/api';

// Service Worker registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registration successful:', registration);
      
      // Setup push notification subscription
      setupPushNotification(registration);
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};

// Setup push notification subscription
const setupPushNotification = async (registration) => {
  const auth = AuthStore.getAuth();
  
  // Only setup if user is logged in
  if (!auth) return;
  
  try {
    const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
    
    // Convert VAPID key to the format expected by the browser
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    
    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      
      // Send subscription to server
      await StoryApi.subscribeNotification({
        token: auth.token,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
        },
      });
    }
  } catch (error) {
    console.error('Error setting up push notification:', error);
  }
};

// Helper function to convert base64 to Uint8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
};

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
  // Register service worker
  registerServiceWorker();
  
  // Update navigation based on auth state
  updateNavigation();
  
  // Initialize app
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    updateActiveNavLink();
  });
});

// Update navigation based on auth state
function updateNavigation() {
  const navList = document.getElementById('nav-list');
  
  if (AuthStore.isLoggedIn()) {
    navList.innerHTML = `
      <li><a href="#/" class="nav-link active">Home</a></li>
      <li><a href="#/map" class="nav-link">Story Map</a></li>
      <li><a href="#/add" class="nav-link">Add Story</a></li>
      <li><a href="#/about" class="nav-link">About</a></li>
      <li><a href="#" id="logout-button" class="nav-link">Logout</a></li>
    `;
    
    // Setup logout button
    document.getElementById('logout-button').addEventListener('click', (event) => {
      event.preventDefault();
      AuthStore.destroyAuth();
      window.location.hash = '#/';
      window.location.reload(); // Reload to update navigation
    });
  } else {
    navList.innerHTML = `
      <li><a href="#/" class="nav-link active">Home</a></li>
      <li><a href="#/login" class="nav-link">Login</a></li>
      <li><a href="#/register" class="nav-link">Register</a></li>
    `;
  }
}

// Update active navigation link based on current hash
function updateActiveNavLink() {
  const currentHash = window.location.hash || '#/';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentHash) {
      link.classList.add('active');
    }
  });
}