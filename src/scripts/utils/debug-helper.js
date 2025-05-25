// Debug helper for camera and location issues

// Enable debug mode
const DEBUG_MODE = true;

// Debug logger
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log('%c[Debug]', 'background: #2658c9; color: white; padding: 2px 4px; border-radius: 2px;', ...args);
  }
}

// Check browser capabilities
function checkBrowserCapabilities() {
  debugLog('Checking browser capabilities...');
  
  // Check if running on HTTPS or localhost
  const isSecureContext = window.isSecureContext;
  debugLog('Secure context (HTTPS or localhost):', isSecureContext);
  
  // Check if MediaDevices API is supported
  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  debugLog('MediaDevices API supported:', hasMediaDevices);
  
  // Check if Geolocation API is supported
  const hasGeolocation = 'geolocation' in navigator;
  debugLog('Geolocation API supported:', hasGeolocation);
  
  // Get browser info
  const userAgent = navigator.userAgent;
  const browserInfo = {
    isChrome: /Chrome/.test(userAgent) && !/Edge/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isEdge: /Edge/.test(userAgent),
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  };
  debugLog('Browser info:', browserInfo);
  
  return {
    isSecureContext,
    hasMediaDevices,
    hasGeolocation,
    browserInfo
  };
}

// Test camera access
async function testCameraAccess() {
  try {
    debugLog('Testing camera access...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    debugLog('Camera access successful!');
    
    // Stop all tracks
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    debugLog('Camera access failed:', error);
    return false;
  }
}

// Test geolocation access
function testGeolocationAccess() {
  return new Promise((resolve) => {
    debugLog('Testing geolocation access...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        debugLog('Geolocation access successful!', position.coords);
        resolve(true);
      },
      (error) => {
        debugLog('Geolocation access failed:', error);
        resolve(false);
      },
      { timeout: 5000 }
    );
  });
}

// Initialize debug helper
async function initDebugHelper() {
  if (!DEBUG_MODE) return;
  
  debugLog('Debug helper initialized');
  
  // Check browser capabilities
  const capabilities = checkBrowserCapabilities();
  
  // Show warning if not on HTTPS
  if (!capabilities.isSecureContext) {
    console.warn('%c[Warning] Not running in secure context. Camera and location features require HTTPS or localhost.', 'background: #f39c12; color: white; padding: 4px; border-radius: 2px;');
  }
  
  // Check camera and geolocation permissions
  if (navigator.permissions) {
    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' });
      debugLog('Camera permission status:', cameraPermission.state);
      
      if (cameraPermission.state === 'denied') {
        console.warn('%c[Warning] Camera permission is denied. Camera features will not work.', 'background: #f44336; color: white; padding: 4px; border-radius: 2px;');
      }
    } catch (e) {
      debugLog('Could not query camera permission:', e);
    }
    
    try {
      const locationPermission = await navigator.permissions.query({ name: 'geolocation' });
      debugLog('Geolocation permission status:', locationPermission.state);
      
      if (locationPermission.state === 'denied') {
        console.warn('%c[Warning] Geolocation permission is denied. Location features will not work.', 'background: #f44336; color: white; padding: 4px; border-radius: 2px;');
      }
    } catch (e) {
      debugLog('Could not query geolocation permission:', e);
    }
  }
}

// Add to window for console access
window.debugHelper = {
  checkBrowserCapabilities,
  testCameraAccess,
  testGeolocationAccess
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initDebugHelper);

export { debugLog, checkBrowserCapabilities, testCameraAccess, testGeolocationAccess };