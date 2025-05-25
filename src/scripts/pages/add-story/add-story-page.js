import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';

export default class AddStoryPage {
  constructor() {
    this._mediaStream = null;
    this._photoFile = null;
    this._location = null;
    this._map = null;
    this._marker = null;
    this._isUsingCamera = false;
  }
  
  async render() {
    return `
      <section class="add-story-page">
        <div class="container">
          <div class="add-story-container">
            <div class="add-story-header">
              <h1>Add New Story</h1>
              <a href="#/" class="back-button" aria-label="Back to Home">
                ← Back to Home
              </a>
            </div>
            
            <form id="add-story-form" class="add-story-form">
              <div class="form-group">
                <label for="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder="Share your story..."
                  rows="4"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Photo</label>
                <div class="photo-input-container">
                  <div id="camera-container" class="camera-container">
                    <video id="camera-preview" class="camera-preview" autoplay playsinline style="display: none;"></video>
                    <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
                    <div id="photo-preview-container" class="photo-preview-container">
                      <div class="no-photo-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                          <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                        <p>No photo selected</p>
                      </div>
                      <img id="photo-preview" class="photo-preview" alt="Preview of captured photo" style="display: none;" />
                    </div>
                  </div>
                  
                  <div class="camera-controls">
                    <button type="button" id="open-camera-btn" class="camera-btn primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                      Open Camera
                    </button>
                    <button type="button" id="take-photo-btn" class="camera-btn secondary" style="display: none;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Take Photo
                    </button>
                    <button type="button" id="switch-camera-btn" class="camera-btn secondary" style="display: none;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 2v6h6"></path>
                        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                        <path d="M21 22v-6h-6"></path>
                        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                      </svg>
                      Switch Camera
                    </button>
                    <button type="button" id="reset-btn" class="camera-btn reset" style="display: none;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                      Reset
                    </button>
                  </div>
                  
                  <div class="file-upload-section">
                    <p>Or upload a photo:</p>
                    <input 
                      type="file" 
                      id="photo-upload" 
                      name="photo" 
                      accept="image/*"
                      aria-label="Upload a photo"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>Location (Optional)</label>
                <div id="location-map" class="location-map"></div>
                
                <div class="location-controls">
                  <button type="button" id="use-my-location-btn" class="location-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Use My Location
                  </button>
                  
                  <div class="location-info">
                    <p id="location-text">Or click on the map to select a location</p>
                    <div id="location-display" class="location-display" style="display: none;">
                      <span id="location-coords"></span>
                      <button type="button" id="clear-location-btn" class="clear-location-btn">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div id="error-container" class="error-container"></div>
              
              <div class="form-actions">
                <button type="submit" id="submit-button" class="submit-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  </svg>
                  Post Story
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initialUI();
    
    // Check HTTPS requirement
    if (!this._checkHTTPS()) {
      return; // Don't setup camera if HTTPS is not available
    }
    
    this._setupForm();
    this._setupCamera();
    this._setupLocationMap();
  }
  
  _initialUI() {
    // Update active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#/add') {
        link.classList.add('active');
      }
    });
    
    // If not logged in, redirect to login
    if (!AuthStore.isLoggedIn()) {
      window.location.hash = '#/login';
    }
    
    // Make sure photo preview container is visible
    const photoPreviewContainer = document.getElementById('photo-preview-container');
    if (photoPreviewContainer) {
      photoPreviewContainer.style.display = 'block';
    }
  }
  
  // Check HTTPS and show warning if needed
  _checkHTTPS() {
    const errorContainer = document.getElementById('error-container');
    const isLocalhost = location.hostname === 'localhost' || 
                        location.hostname === '127.0.0.1' ||
                        location.hostname.includes('netlify.app'); // Allow netlify preview URLs
    
    if (location.protocol !== 'https:' && !isLocalhost) {
    //  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      errorContainer.innerHTML = `
        <div class="https-warning">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <circle cx="12" cy="17" r="1"></circle>
          </svg>
          <div>
            <strong>HTTPS Required:</strong> Camera access requires a secure connection. 
            Please access this site via HTTPS or use localhost for development.
          </div>
        </div>
      `;
      return false;
    }
    return true;
  }
  
  _setupCamera() {
    const openCameraBtn = document.getElementById('open-camera-btn');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    const resetBtn = document.getElementById('reset-btn');
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const photoPreviewContainer = document.getElementById('photo-preview-container');
    const photoPreview = document.getElementById('photo-preview');
    
    // Ensure elements exist
    if (!openCameraBtn || !cameraPreview || !photoPreviewContainer) {
      console.error('Camera UI elements not found');
      this._showError('An error occurred while initializing the camera interface');
      return;
    }
    
    const noPhotoPlaceholder = photoPreviewContainer.querySelector('.no-photo-placeholder');
    
    let currentCamera = 'environment'; // Start with back camera
    
    // Open camera when button is clicked
    openCameraBtn.addEventListener('click', async () => {
      try {
        // Show loading state
        openCameraBtn.innerHTML = `
          <div class="loading-spinner"></div>
          Requesting Camera...
        `;
        openCameraBtn.disabled = true;
        
        // Show permission indicator
        this._showPermissionIndicator('Please allow camera access when prompted');
        
        // Check if camera permission is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
        }
        
        // Debugging info - check all available devices
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          console.log('Available video devices:', videoDevices.length);
          videoDevices.forEach((device, index) => {
            console.log(`Camera #${index + 1}: ${device.label || 'Unnamed camera'}`);
          });
        } catch (enumError) {
          console.log('Could not enumerate devices:', enumError);
        }
        
        // Check current permission status
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'camera' });
            console.log('Camera permission status:', permission.state);
            
            if (permission.state === 'denied') {
              throw new Error('Camera access has been denied. Please enable camera permission in your browser settings and refresh the page.');
            }
          } catch (permError) {
            console.log('Permission API not fully supported, proceeding with direct request');
          }
        }
        
        // Request camera access - this will trigger the permission dialog
        await this._startCamera(currentCamera);
        
        // Update UI on success
        cameraPreview.style.display = 'block';
        if (noPhotoPlaceholder) {
          noPhotoPlaceholder.style.display = 'none';
        }
        photoPreview.style.display = 'none';
        
        // Show camera controls
        openCameraBtn.style.display = 'none';
        takePhotoBtn.style.display = 'inline-flex';
        switchCameraBtn.style.display = 'inline-flex';
        resetBtn.style.display = 'inline-flex';
        
        this._isUsingCamera = true;
        
        // Show success indicator
        this._showPermissionIndicator('Camera access granted!', 'success');
        
      } catch (error) {
        console.error('Error accessing camera:', error);
        
        // Reset button state
        openCameraBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Open Camera
        `;
        openCameraBtn.disabled = false;
        
        // Show detailed error message based on error type
        let errorMessage = 'Unable to access camera. ';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage += 'Camera permission was denied. Please click "Allow" when prompted or enable camera access in your browser settings.';
          this._showCameraPermissionHelp();
          this._showPermissionIndicator('Camera permission denied', 'error');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera found on this device.';
          this._showPermissionIndicator('No camera found', 'error');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage += 'Camera is already in use by another application.';
          this._showPermissionIndicator('Camera in use by another app', 'error');
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
          errorMessage += 'Camera does not support the requested settings.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera is not supported in this browser.';
        } else if (error.name === 'SecurityError') {
          errorMessage += 'Camera access blocked due to security restrictions. Please use HTTPS.';
        } else {
          errorMessage += error.message || 'Please try using the file upload option instead.';
        }
        
        this._showError(errorMessage);
      }
    });
    
    // Take photo when button is clicked
    takePhotoBtn.addEventListener('click', () => {
      try {
        if (!this._mediaStream) {
          throw new Error('Camera is not active. Please restart the camera.');
        }
        
        this._capturePhoto();
        
        // Hide camera, show photo preview
        cameraPreview.style.display = 'none';
        photoPreview.style.display = 'block';
        if (noPhotoPlaceholder) {
          noPhotoPlaceholder.style.display = 'none';
        }
        
        // Update button states
        takePhotoBtn.style.display = 'none';
        switchCameraBtn.style.display = 'none';
        
        // Stop camera stream
        this._stopMediaStream();
        this._isUsingCamera = false;
        
        this._showPermissionIndicator('Photo captured!', 'success');
      } catch (error) {
        console.error('Error capturing photo:', error);
        this._showError('Failed to capture photo: ' + error.message);
      }
    });
    
    // Switch camera (front/back)
    switchCameraBtn.addEventListener('click', async () => {
      currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
      
      switchCameraBtn.innerHTML = `
        <div class="loading-spinner"></div>
        Switching...
      `;
      switchCameraBtn.disabled = true;
      
      try {
        this._stopMediaStream();
        await this._startCamera(currentCamera);
        
        switchCameraBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
          Switch Camera
        `;
        switchCameraBtn.disabled = false;
        
        const cameraType = currentCamera === 'environment' ? 'Back' : 'Front';
        this._showPermissionIndicator(`Switched to ${cameraType} camera`, 'success');
      } catch (error) {
        console.error('Error switching camera:', error);
        this._showError('Unable to switch camera. Using current camera.');
        
        switchCameraBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
          </svg>
          Switch Camera
        `;
        switchCameraBtn.disabled = false;
      }
    });
    
    // Reset/clear photo
    resetBtn.addEventListener('click', () => {
      this._resetCamera();
    });
    
    // Handle file upload
    const photoUpload = document.getElementById('photo-upload');
    photoUpload.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        this._handleFileUpload(event.target.files[0]);
      }
    });
  }
  
  // Enhanced startCamera method with better error handling
  async _startCamera(facingMode) {
    console.log(`Starting camera with facingMode: ${facingMode}`);
    
    // Try different constraint configurations for better compatibility
    const constraints = [
      // First try: specific facingMode with ideal resolution
      {
        video: { 
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false,
      },
      // Second try: just facingMode
      {
        video: { facingMode: facingMode },
        audio: false,
      },
      // Third try: any camera with fallback options
      {
        video: { 
          facingMode: facingMode,
          width: { ideal: 320 },
          height: { ideal: 240 }
        },
        audio: false,
      },
      // Last resort: any video device
      {
        video: true,
        audio: false,
      }
    ];
    
    let lastError;
    
    for (let i = 0; i < constraints.length; i++) {
      try {
        console.log(`Trying camera constraint ${i + 1}:`, constraints[i]);
        this._mediaStream = await navigator.mediaDevices.getUserMedia(constraints[i]);
        
        const cameraPreview = document.getElementById('camera-preview');
        if (!cameraPreview) {
          throw new Error('Camera preview element not found');
        }
        
        // Set the stream as the source of the video element
        cameraPreview.srcObject = this._mediaStream;
        
        // Log when video metadata is loaded
        console.log('Video metadata loaded, camera ready');
        
        // Wait for video to load
        return new Promise((resolve, reject) => {
          cameraPreview.onloadedmetadata = () => {
            console.log('Camera started successfully', cameraPreview.videoWidth, 'x', cameraPreview.videoHeight);
            resolve();
          };
          
          cameraPreview.onerror = (error) => {
            console.error('Video element error:', error);
            reject(new Error('Failed to display camera feed'));
          };
          
          // Timeout after 10 seconds
          setTimeout(() => {
            reject(new Error('Camera initialization timeout'));
          }, 10000);
        });
        
      } catch (error) {
        console.error(`Camera constraint ${i + 1} failed:`, error);
        lastError = error;
        
        if (i === constraints.length - 1) {
          // All constraints failed, throw the last error
          throw lastError;
        }
      }
    }
  }
  
  _capturePhoto() {
    console.log('Capturing photo');
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const photoPreview = document.getElementById('photo-preview');
    
    if (!cameraPreview || !photoCanvas || !photoPreview) {
      throw new Error('Required photo elements not found');
    }
    
    // Check if video is ready
    if (!cameraPreview.videoWidth) {
      throw new Error('Camera video is not ready yet');
    }
    
    // Set canvas dimensions to match video
    photoCanvas.width = cameraPreview.videoWidth;
    photoCanvas.height = cameraPreview.videoHeight;
    
    console.log(`Canvas dimensions set to ${photoCanvas.width}x${photoCanvas.height}`);
    
    try {
      // Draw video frame to canvas
      const context = photoCanvas.getContext('2d');
      context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
      
      console.log('Image drawn to canvas');
      
      // Convert canvas to blob
      photoCanvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }
        
        console.log(`Photo blob created: ${blob.size} bytes`);
        
        // Create a File object from the blob
        this._photoFile = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Display the captured photo
        const photoUrl = URL.createObjectURL(blob);
        photoPreview.src = photoUrl;
        photoPreview.onload = () => {
          console.log('Photo preview loaded successfully');
        };
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw new Error('Failed to capture photo: ' + error.message);
    }
  }
  
  _handleFileUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this._showError('Please select a valid image file.');
      return;
    }
    
    // Validate file size (max 1MB as per API requirement)
    if (file.size > 1024 * 1024) {
      this._showError('Image file size must be less than 1MB.');
      return;
    }
    
    this._photoFile = file;
    
    // Display the selected photo
    const photoUrl = URL.createObjectURL(file);
    const photoPreview = document.getElementById('photo-preview');
    const noPhotoPlaceholder = document.querySelector('.no-photo-placeholder');
    
    if (!photoPreview) {
      this._showError('Photo preview element not found');
      return;
    }
    
    photoPreview.src = photoUrl;
    photoPreview.style.display = 'block';
    
    if (noPhotoPlaceholder) {
      noPhotoPlaceholder.style.display = 'none';
    }
    
    // Show reset button
    document.getElementById('reset-btn').style.display = 'inline-flex';
    document.getElementById('open-camera-btn').style.display = 'none';
    
    // Stop camera if running
    if (this._isUsingCamera) {
      this._stopMediaStream();
      document.getElementById('camera-preview').style.display = 'none';
      document.getElementById('take-photo-btn').style.display = 'none';
      document.getElementById('switch-camera-btn').style.display = 'none';
      this._isUsingCamera = false;
    }
    
    this._showPermissionIndicator('Photo uploaded successfully!', 'success');
  }
  
  _resetCamera() {
    // Clear photo
    this._photoFile = null;
    
    // Reset UI
    const photoPreview = document.getElementById('photo-preview');
    const noPhotoPlaceholder = document.querySelector('.no-photo-placeholder');
    const cameraPreview = document.getElementById('camera-preview');
    
    if (photoPreview) {
      photoPreview.src = '';
      photoPreview.style.display = 'none';
    }
    
    if (cameraPreview) {
      cameraPreview.style.display = 'none';
    }
    
    if (noPhotoPlaceholder) {
      noPhotoPlaceholder.style.display = 'block';
    }
    
    // Reset buttons
    const openCameraBtn = document.getElementById('open-camera-btn');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (openCameraBtn) openCameraBtn.style.display = 'inline-flex';
    if (takePhotoBtn) takePhotoBtn.style.display = 'none';
    if (switchCameraBtn) switchCameraBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    
    // Clear file input
    const photoUpload = document.getElementById('photo-upload');
    if (photoUpload) photoUpload.value = '';
    
    // Stop camera stream
    this._stopMediaStream();
    this._isUsingCamera = false;
    
    // Clear any error messages
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) errorContainer.innerHTML = '';
  }
  
  _setupLocationMap() {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }
    
    if (!window.L) {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(leafletScript);
      
      leafletScript.onload = () => {
        this._initMap();
      };
      
      leafletScript.onerror = () => {
        console.error('Failed to load Leaflet');
        document.getElementById('location-map').innerHTML = `
          <div class="map-error">
            <p>Unable to load map. Please check your internet connection.</p>
          </div>
        `;
      };
    } else {
      this._initMap();
    }
  }
  
  _initMap() {
    try {
      // Create map centered at Indonesia
      this._map = L.map('location-map').setView([-6.2088, 106.8456], 10); // Jakarta
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this._map);
      
      // Fix map size after it's rendered
      setTimeout(() => {
        this._map.invalidateSize();
      }, 100);
      
      // Setup location controls
      this._setupLocationControls();
      
      // Add click event to the map
      this._map.on('click', (event) => {
        this._setLocation(event.latlng.lat, event.latlng.lng);
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      document.getElementById('location-map').innerHTML = `
        <div class="map-error">
          <p>Error loading map. Location selection is optional.</p>
        </div>
      `;
    }
  }
  
  _setupLocationControls() {
    const useMyLocationBtn = document.getElementById('use-my-location-btn');
    const clearLocationBtn = document.getElementById('clear-location-btn');
    
    // Use my location button
    useMyLocationBtn.addEventListener('click', () => {
      if ('geolocation' in navigator) {
        useMyLocationBtn.innerHTML = `
          <div class="loading-spinner"></div>
          Getting location...
        `;
        useMyLocationBtn.disabled = true;
        
        this._showPermissionIndicator('Getting your location...');
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this._setLocation(latitude, longitude);
            this._map.setView([latitude, longitude], 15);
            
            // Reset button
            useMyLocationBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Use My Location
            `;
            useMyLocationBtn.disabled = false;
            
            this._showPermissionIndicator('Location found!', 'success');
          },
          (error) => {
            console.error('Geolocation error:', error);
            
            let errorMessage = 'Unable to get your location. ';
            if (error.code === error.PERMISSION_DENIED) {
              errorMessage += 'Location permission denied.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              errorMessage += 'Location information unavailable.';
            } else if (error.code === error.TIMEOUT) {
              errorMessage += 'Location request timed out.';
            }
            errorMessage += ' Please select manually on the map.';
            
            this._showError(errorMessage);
            this._showPermissionIndicator('Location access failed', 'error');
            
            // Reset button
            useMyLocationBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Use My Location
            `;
            useMyLocationBtn.disabled = false;
          },
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 60000 
          }
        );
      } else {
        this._showError('Geolocation is not supported by your browser.');
      }
    });
    
    // Clear location button
    clearLocationBtn.addEventListener('click', () => {
      this._clearLocation();
    });
  }
  
  _setLocation(lat, lng) {
    // Remove existing marker
    if (this._marker) {
      this._map.removeLayer(this._marker);
    }
    
    // Add new marker
    this._marker = L.marker([lat, lng]).addTo(this._map);
    
    // Update location data
    this._location = { lat, lon: lng };
    
    // Update UI
    const locationText = document.getElementById('location-text');
    const locationDisplay = document.getElementById('location-display');
    const locationCoords = document.getElementById('location-coords');
    
    locationText.style.display = 'none';
    locationDisplay.style.display = 'flex';
    locationCoords.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
  
  _clearLocation() {
    // Remove marker
    if (this._marker) {
      this._map.removeLayer(this._marker);
      this._marker = null;
    }
    
    // Clear location data
    this._location = null;
    
    // Update UI
    const locationText = document.getElementById('location-text');
    const locationDisplay = document.getElementById('location-display');
    
    locationText.style.display = 'block';
    locationDisplay.style.display = 'none';
  }
}