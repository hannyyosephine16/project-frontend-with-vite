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
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('Service worker registration successful:', registration);
      
      // Setup push notification subscription after registration
      registration.addEventListener('updatefound', () => {
        console.log('New service worker found');
      });
      
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
  if (!auth) {
    console.log('User not logged in, skipping push notification setup');
    return;
  }
  
  try {
    // Check if notification permission is granted
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return;
      }
    }
    
    if (Notification.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }
    
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
      
      console.log('Push subscription created:', subscription);
      
      // Send subscription to server
      try {
        await StoryApi.subscribeNotification({
          token: auth.token,
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
          },
        });
        console.log('Push subscription sent to server');
      } catch (apiError) {
        console.error('Failed to send subscription to server:', apiError);
      }
    } else {
      console.log('Push subscription already exists');
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
  console.log('Application initializing...');
  
  // Register service worker
  await registerServiceWorker();
  
  // Update navigation based on auth state
  updateNavigation();
  
  // Initialize app
  const app = new App({
    content: document.querySelector('#main-content'),
  });
  
  // Render initial page
  await app.renderPage();

  // Handle hash changes for SPA routing
  window.addEventListener('hashchange', async () => {
    console.log('Hash changed to:', window.location.hash);
    await app.renderPage();
    updateActiveNavLink();
  });
  
  // Update active nav link on initial load
  updateActiveNavLink();
  
  console.log('Application initialized successfully');
});

// Update navigation based on auth state
function updateNavigation() {
  const navList = document.getElementById('nav-list');
  
  if (AuthStore.isLoggedIn()) {
    const auth = AuthStore.getAuth();
    console.log('User is logged in:', auth.name);
    
    navList.innerHTML = `
      <li><a href="#/" class="nav-link">Home</a></li>
      <li><a href="#/map" class="nav-link">Story Map</a></li>
      <li><a href="#/add" class="nav-link">Add Story</a></li>
      <li><a href="#/about" class="nav-link">About</a></li>
      <li><a href="#" id="logout-button" class="nav-link">Logout (${auth.name})</a></li>
    `;
    
    // Setup logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('User logging out');
        
        // Unsubscribe from push notifications before logout
        unsubscribeFromPushNotifications().finally(() => {
          AuthStore.destroyAuth();
          window.location.hash = '#/';
          window.location.reload(); // Reload to update navigation
        });
      });
    }
  } else {
    console.log('User is not logged in');
    navList.innerHTML = `
      <li><a href="#/" class="nav-link">Home</a></li>
      <li><a href="#/login" class="nav-link">Login</a></li>
      <li><a href="#/register" class="nav-link">Register</a></li>
    `;
  }
}

// Unsubscribe from push notifications
const unsubscribeFromPushNotifications = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          const auth = AuthStore.getAuth();
          if (auth) {
            try {
              // Unsubscribe from server
              await StoryApi.unsubscribeNotification({
                token: auth.token,
                endpoint: subscription.endpoint,
              });
              console.log('Unsubscribed from server');
            } catch (error) {
              console.error('Failed to unsubscribe from server:', error);
            }
          }
          
          // Unsubscribe locally
          await subscription.unsubscribe();
          console.log('Push subscription cancelled');
        }
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  }
};

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

// Handle authentication state changes
window.addEventListener('storage', (event) => {
  if (event.key === AuthStore.AUTH_KEY) {
    console.log('Auth state changed in another tab');
    updateNavigation();
    updateActiveNavLink();
  }
});