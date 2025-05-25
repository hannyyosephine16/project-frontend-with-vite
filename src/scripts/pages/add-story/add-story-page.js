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
    this._currentFacingMode = 'environment';
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
                  
                  <!-- Enhanced Camera Interface -->
                  <div id="camera-interface" class="camera-interface">
                    <div class="camera-main">
                      <!-- Permission Request Screen -->
                      <div id="permission-screen" class="permission-screen active">
                        <div class="permission-content">
                          <div class="camera-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                              <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                          </div>
                          <h3>Camera Access Needed</h3>
                          <p>Allow camera access to take photos for your story</p>
                          <button type="button" id="request-camera-btn" class="request-camera-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                              <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            Open Camera
                          </button>
                        </div>
                      </div>

                      <!-- Camera View Screen -->
                      <div id="camera-view" class="camera-view">
                        <video id="camera-preview" class="camera-preview" autoplay playsinline muted></video>
                        <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
                        
                        <!-- Camera Overlay UI -->
                        <div class="camera-overlay">
                          <div class="camera-top-bar">
                            <button type="button" id="close-camera-btn" class="camera-control-btn close-btn">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                            <div class="camera-status">
                              <div class="recording-indicator"></div>
                              <span>Camera Active</span>
                            </div>
                          </div>
                          
                          <div class="camera-bottom-bar">
                            <button type="button" id="switch-camera-btn" class="camera-control-btn switch-btn">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 2v6h6"></path>
                                <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                                <path d="M21 22v-6h-6"></path>
                                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                              </svg>
                            </button>
                            
                            <button type="button" id="capture-btn" class="capture-btn">
                              <div class="capture-ring">
                                <div class="capture-inner"></div>
                              </div>
                            </button>
                            
                            <button type="button" id="gallery-btn" class="camera-control-btn gallery-btn">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21,15 16,10 5,21"></polyline>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Photo Preview Screen -->
                      <div id="photo-result" class="photo-result">
                        <img id="captured-photo" class="captured-photo" alt="Captured photo" />
                        <div class="photo-actions">
                          <button type="button" id="reset-photo-btn" class="action-btn reset">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                            Reset
                          </button>
                          <button type="button" id="retake-btn" class="action-btn secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                              <path d="M21 3v5h-5"></path>
                              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                              <path d="M3 21v-5h5"></path>
                            </svg>
                            Retake
                          </button>
                          <button type="button" id="use-photo-btn" class="action-btn primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                            Use Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- File Upload Alternative -->
                  <div class="file-upload-section">
                    <div class="upload-divider">
                      <span>Or upload from gallery</span>
                    </div>
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
    console.log('AddStoryPage: afterRender');
    
    this._initialUI();
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
  }
  
  _setupCamera() {
    console.log('Setting up enhanced camera...');
    
    // Get camera elements
    const permissionScreen = document.getElementById('permission-screen');
    const cameraView = document.getElementById('camera-view');
    const photoResult = document.getElementById('photo-result');
    const requestCameraBtn = document.getElementById('request-camera-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const usePhotoBtn = document.getElementById('use-photo-btn');
    const resetPhotoBtn = document.getElementById('reset-photo-btn');
    const galleryBtn = document.getElementById('gallery-btn');
    const cameraPreview = document.getElementById('camera-preview');
    const capturedPhoto = document.getElementById('captured-photo');
    
    // Request camera permission and open camera
    requestCameraBtn.addEventListener('click', async () => {
      try {
        await this._requestCameraPermission();
        this._showCameraView();
      } catch (error) {
        console.error('Camera permission error:', error);
        this._showError(this._getCameraErrorMessage(error));
      }
    });
    
    // Close camera
    closeCameraBtn.addEventListener('click', () => {
      this._closeCameraView();
    });
    
    // Switch camera (front/back)
    switchCameraBtn.addEventListener('click', async () => {
      await this._switchCamera();
    });
    
    // Capture photo
    captureBtn.addEventListener('click', async () => {
      // Add small delay to ensure video is stable
      captureBtn.disabled = true;
      captureBtn.style.opacity = '0.7';
      
      // Wait 200ms for video to stabilize
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        this._capturePhoto();
      } finally {
        captureBtn.disabled = false;
        captureBtn.style.opacity = '1';
      }
    });
    
    // Retake photo
    retakeBtn.addEventListener('click', () => {
      console.log('Retake button clicked');
      this._retakePhoto();
    });
    
    // Use captured photo
    usePhotoBtn.addEventListener('click', () => {
      console.log('Use photo button clicked');
      this._usePhoto();
    });
    
    // Reset photo (clear and go back to permission screen)
    resetPhotoBtn.addEventListener('click', () => {
      console.log('Reset photo button clicked');
      this._resetPhoto();
    });
    
    // Debug: Check if buttons exist
    console.log('Photo action buttons:', {
      retakeBtn: !!retakeBtn,
      usePhotoBtn: !!usePhotoBtn,
      resetPhotoBtn: !!resetPhotoBtn
    });
    
    // Open gallery (file upload)
    galleryBtn.addEventListener('click', () => {
      document.getElementById('photo-upload').click();
    });
    
    // Handle file upload
    const photoUpload = document.getElementById('photo-upload');
    photoUpload.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        this._handleFileUpload(event.target.files[0]);
      }
    });
  }
  
  async _requestCameraPermission() {
    console.log('Requesting camera permission...');
    
    // Update button to loading state
    const requestBtn = document.getElementById('request-camera-btn');
    requestBtn.innerHTML = `
      <div class="loading-spinner"></div>
      Requesting Permission...
    `;
    requestBtn.disabled = true;
    
    // Check if running in secure context
    if (!window.isSecureContext) {
      throw new Error('Camera requires HTTPS or localhost');
    }
    
    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera not supported in this browser');
    }
    
    // Show permission notification
    this._showPermissionIndicator('Browser will ask for camera permission. Please click "Allow"', 'info');
    
    try {
      // Try different camera constraints for better compatibility
      const constraints = [
        // First try: specific facing mode with good resolution
        {
          video: { 
            facingMode: this._currentFacingMode,
            width: { ideal: 640, min: 320, max: 1280 },
            height: { ideal: 480, min: 240, max: 720 },
            frameRate: { ideal: 30, min: 15, max: 60 }
          },
          audio: false
        },
        // Second try: just facing mode with basic constraints
        {
          video: { 
            facingMode: this._currentFacingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        },
        // Third try: facing mode only
        {
          video: { 
            facingMode: this._currentFacingMode
          },
          audio: false
        },
        // Fourth try: basic video only
        {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        },
        // Last try: most basic
        {
          video: true,
          audio: false
        }
      ];

      let stream = null;
      let lastError = null;

      // Try each constraint until one works
      for (let i = 0; i < constraints.length; i++) {
        try {
          console.log(`Trying camera constraint ${i + 1}:`, constraints[i]);
          stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
          console.log('Camera stream obtained successfully');
          break;
        } catch (error) {
          console.log(`Constraint ${i + 1} failed:`, error.name, error.message);
          lastError = error;
          if (i === constraints.length - 1) {
            throw lastError;
          }
        }
      }

      this._mediaStream = stream;
      
      // Set up video stream
      const cameraPreview = document.getElementById('camera-preview');
      cameraPreview.srcObject = this._mediaStream;
      
      // Configure video element properly
      cameraPreview.muted = true;
      cameraPreview.playsInline = true;
      cameraPreview.autoplay = true;
      cameraPreview.controls = false;
      
      // Force video to be visible and unfiltered
      cameraPreview.style.display = 'block';
      cameraPreview.style.visibility = 'visible';
      cameraPreview.style.opacity = '1';
      cameraPreview.style.filter = 'none';
      cameraPreview.style.transform = 'none';
      
      // Wait for video to be ready and playing
      await new Promise((resolve, reject) => {
        let resolved = false;
        let attempts = 0;
        const maxAttempts = 20;
        
        const checkVideo = () => {
          attempts++;
          console.log(`Video check attempt ${attempts}:`, {
            videoWidth: cameraPreview.videoWidth,
            videoHeight: cameraPreview.videoHeight,
            readyState: cameraPreview.readyState,
            paused: cameraPreview.paused,
            currentTime: cameraPreview.currentTime
          });
          
          if (cameraPreview.videoWidth > 0 && cameraPreview.videoHeight > 0) {
            if (!resolved) {
              resolved = true;
              console.log('Video ready with dimensions:', cameraPreview.videoWidth, 'x', cameraPreview.videoHeight);
              resolve();
            }
            return;
          }
          
          if (attempts >= maxAttempts) {
            if (!resolved) {
              resolved = true;
              console.warn('Video setup timeout, but proceeding...');
              resolve(); // Proceed anyway
            }
            return;
          }
          
          // Try again in 200ms
          setTimeout(checkVideo, 200);
        };
        
        // Set up event listeners
        cameraPreview.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          checkVideo();
        };
        
        cameraPreview.oncanplay = () => {
          console.log('Video can play');
          checkVideo();
        };
        
        cameraPreview.onplaying = () => {
          console.log('Video is playing');
          checkVideo();
        };
        
        cameraPreview.onerror = (error) => {
          if (!resolved) {
            resolved = true;
            console.error('Video element error:', error);
            reject(new Error('Failed to display camera feed'));
          }
        };
        
        // Try to play the video manually
        cameraPreview.play().then(() => {
          console.log('Video play() succeeded');
          setTimeout(checkVideo, 100);
        }).catch(error => {
          console.log('Video play() failed (might be normal):', error);
          setTimeout(checkVideo, 100);
        });
        
        // Start checking immediately
        setTimeout(checkVideo, 100);
      });
      
      this._showPermissionIndicator('Camera access granted!', 'success');
      
    } catch (error) {
      console.error('Camera permission error:', error);
      
      // Reset button
      requestBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        Open Camera
      `;
      requestBtn.disabled = false;
      
      throw error;
    }
  }
  
  _showCameraView() {
    document.getElementById('permission-screen').classList.remove('active');
    document.getElementById('camera-view').classList.add('active');
    document.getElementById('photo-result').classList.remove('active');
    this._isUsingCamera = true;
    
    // Ensure video visibility after view change
    setTimeout(() => {
      const cameraPreview = document.getElementById('camera-preview');
      
      // Force video visibility
      cameraPreview.style.display = 'block';
      cameraPreview.style.visibility = 'visible';
      cameraPreview.style.opacity = '1';
      cameraPreview.style.filter = 'none';
      cameraPreview.style.transform = 'none';
      cameraPreview.style.background = '#000';
      
      console.log('Camera view shown, video state:', {
        videoWidth: cameraPreview.videoWidth,
        videoHeight: cameraPreview.videoHeight,
        readyState: cameraPreview.readyState,
        paused: cameraPreview.paused,
        ended: cameraPreview.ended,
        currentTime: cameraPreview.currentTime,
        srcObject: !!cameraPreview.srcObject
      });
      
      // Ensure video is playing
      if (cameraPreview.paused && cameraPreview.srcObject) {
        console.log('Video was paused, attempting to play...');
        cameraPreview.play().catch(e => console.log('Play failed:', e));
      }
      
      // Double-check stream is active
      if (this._mediaStream && !this._mediaStream.active) {
        console.warn('Media stream is not active!');
        this._showError('Camera stream lost. Please try again.');
      }
    }, 200);
  }
  
  _closeCameraView() {
    this._stopMediaStream();
    document.getElementById('permission-screen').classList.add('active');
    document.getElementById('camera-view').classList.remove('active');
    document.getElementById('photo-result').classList.remove('active');
    this._isUsingCamera = false;
  }
  
  async _switchCamera() {
    const switchBtn = document.getElementById('switch-camera-btn');
    
    // Show loading state
    switchBtn.innerHTML = `
      <div class="loading-spinner"></div>
    `;
    switchBtn.disabled = true;
    
    try {
      // Switch facing mode
      this._currentFacingMode = this._currentFacingMode === 'environment' ? 'user' : 'environment';
      
      // Stop current stream
      this._stopMediaStream();
      
      // Start new stream with different camera
      this._mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: this._currentFacingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      // Update preview
      const cameraPreview = document.getElementById('camera-preview');
      cameraPreview.srcObject = this._mediaStream;
      
      const cameraType = this._currentFacingMode === 'environment' ? 'Back' : 'Front';
      this._showPermissionIndicator(`Switched to ${cameraType} camera`, 'success');
      
    } catch (error) {
      console.error('Error switching camera:', error);
      this._showError('Unable to switch camera');
    } finally {
      // Reset button
      switchBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 2v6h6"></path>
          <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
          <path d="M21 22v-6h-6"></path>
          <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
        </svg>
      `;
      switchBtn.disabled = false;
    }
  }
  
  _capturePhoto() {
    console.log('Capturing photo...');
    
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const capturedPhoto = document.getElementById('captured-photo');
    
    // Check if video is ready and has valid dimensions
    if (!cameraPreview.videoWidth || !cameraPreview.videoHeight) {
      console.error('Video not ready:', {
        videoWidth: cameraPreview.videoWidth,
        videoHeight: cameraPreview.videoHeight,
        readyState: cameraPreview.readyState
      });
      this._showError('Camera not ready. Please wait a moment and try again.');
      return;
    }
    
    console.log('Video dimensions:', cameraPreview.videoWidth, 'x', cameraPreview.videoHeight);
    
    // Set canvas dimensions to match video
    const width = cameraPreview.videoWidth;
    const height = cameraPreview.videoHeight;
    
    photoCanvas.width = width;
    photoCanvas.height = height;
    
    console.log('Canvas dimensions set to:', width, 'x', height);
    
    try {
      // Get canvas context
      const context = photoCanvas.getContext('2d');
      
      // Clear canvas first
      context.clearRect(0, 0, width, height);
      
      // Draw video frame to canvas
      context.drawImage(cameraPreview, 0, 0, width, height);
      
      console.log('Image drawn to canvas');
      
      // Check if canvas has actual image data (not blank)
      const imageData = context.getImageData(0, 0, width, height);
      const data = imageData.data;
      let hasNonBlackPixels = false;
      
      // Check first 1000 pixels to see if image has content
      for (let i = 0; i < Math.min(4000, data.length); i += 4) {
        if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) {
          hasNonBlackPixels = true;
          break;
        }
      }
      
      if (!hasNonBlackPixels) {
        console.warn('Canvas appears to be blank/black');
        this._showError('Failed to capture image. Please ensure camera is active and try again.');
        return;
      }
      
      // Convert canvas to blob with high quality
      photoCanvas.toBlob((blob) => {
        if (!blob) {
          this._showError('Failed to create image file');
          return;
        }
        
        console.log(`Photo blob created: ${blob.size} bytes, type: ${blob.type}`);
        
        // Create file from blob
        this._photoFile = new File([blob], `camera-photo-${Date.now()}.jpg`, { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        // Create object URL for preview
        const photoUrl = URL.createObjectURL(blob);
        
        // Clean up previous URL if exists
        if (capturedPhoto.src && capturedPhoto.src.startsWith('blob:')) {
          URL.revokeObjectURL(capturedPhoto.src);
        }
        
        // Set new image
        capturedPhoto.src = photoUrl;
        
        // Wait for image to load before showing
        capturedPhoto.onload = () => {
          console.log('Photo preview loaded successfully');
          this._showCapturedPhoto();
          this._showPermissionIndicator('Photo captured successfully!', 'success');
        };
        
        capturedPhoto.onerror = () => {
          console.error('Failed to load captured photo');
          this._showError('Failed to display captured photo');
        };
        
      }, 'image/jpeg', 0.92); // Higher quality
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      this._showError('Failed to capture photo: ' + error.message);
    }
  }
  
  _showCapturedPhoto() {
    console.log('Showing captured photo...');
    
    // Hide other screens
    document.getElementById('permission-screen').classList.remove('active');
    document.getElementById('camera-view').classList.remove('active');
    
    // Show photo result screen
    const photoResult = document.getElementById('photo-result');
    photoResult.classList.add('active');
    
    // Stop camera stream to free up resources
    this._stopMediaStream();
    
    // Force visibility of photo result elements
    setTimeout(() => {
      const capturedPhoto = document.getElementById('captured-photo');
      const photoActions = photoResult.querySelector('.photo-actions');
      
      console.log('Photo result elements:', {
        photoResult: !!photoResult,
        capturedPhoto: !!capturedPhoto,
        photoActions: !!photoActions,
        photoSrc: capturedPhoto?.src || 'no src'
      });
      
      // Ensure photo actions are visible
      if (photoActions) {
        photoActions.style.display = 'flex';
        photoActions.style.visibility = 'visible';
        photoActions.style.opacity = '1';
      }
      
      // Ensure captured photo is visible
      if (capturedPhoto) {
        capturedPhoto.style.display = 'block';
        capturedPhoto.style.visibility = 'visible';
        capturedPhoto.style.opacity = '1';
      }
    }, 100);
  }
  
  _retakePhoto() {
    // Clear current photo
    this._photoFile = null;
    const capturedPhoto = document.getElementById('captured-photo');
    if (capturedPhoto.src && capturedPhoto.src.startsWith('blob:')) {
      URL.revokeObjectURL(capturedPhoto.src);
      capturedPhoto.src = '';
    }
    
    // Go back to camera view and restart camera
    this._showCameraView();
    
    // Check if we still have active stream
    if (!this._mediaStream || !this._mediaStream.active) {
      console.log('Camera stream not active, restarting...');
      this._requestCameraPermission().catch(error => {
        console.error('Error restarting camera:', error);
        this._showPermissionScreen();
        this._showError(this._getCameraErrorMessage(error));
      });
    } else {
      console.log('Camera stream still active, reusing...');
      // Just ensure video is playing
      const cameraPreview = document.getElementById('camera-preview');
      if (cameraPreview.paused) {
        cameraPreview.play().catch(e => console.log('Play error:', e));
      }
    }
  }
  
  _resetPhoto() {
    // Clear the photo file
    this._photoFile = null;
    
    // Clear the captured photo and cleanup URL
    const capturedPhoto = document.getElementById('captured-photo');
    if (capturedPhoto.src && capturedPhoto.src.startsWith('blob:')) {
      URL.revokeObjectURL(capturedPhoto.src);
      capturedPhoto.src = '';
    }
    
    // Stop any active camera stream
    this._stopMediaStream();
    
    // Go back to permission screen
    this._showPermissionScreen();
    this._showPermissionIndicator('Photo cleared. Ready to take a new photo.', 'info');
  }
  
  _showPermissionScreen() {
    document.getElementById('permission-screen').classList.add('active');
    document.getElementById('camera-view').classList.remove('active');
    document.getElementById('photo-result').classList.remove('active');
    this._isUsingCamera = false;
  }
  
  _handleFileUpload(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
      this._showError('Please select a valid image file.');
      return;
    }
    
    if (file.size > 1024 * 1024) {
      this._showError('Image file size must be less than 1MB.');
      return;
    }
    
    this._photoFile = file;
    
    // Show file preview in photo result screen
    const capturedPhoto = document.getElementById('captured-photo');
    const photoUrl = URL.createObjectURL(file);
    capturedPhoto.src = photoUrl;
    
    this._showCapturedPhoto();
    this._showPermissionIndicator('Photo uploaded successfully!', 'success');
  }
  
  _getCameraErrorMessage(error) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return 'Camera permission denied. Please allow camera access and try again.';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'No camera found on this device.';
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      return 'Camera is already in use by another application.';
    } else if (error.name === 'OverconstrainedError') {
      return 'Camera does not support the requested settings.';
    } else if (error.name === 'SecurityError') {
      return 'Camera access blocked. Please use HTTPS.';
    } else {
      return error.message || 'Unable to access camera. Please try uploading from gallery instead.';
    }
  }
  
  _setupLocationMap() {
    console.log('Setting up location map...');
    
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
        console.log('Leaflet loaded successfully');
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
      console.log('Initializing map...');
      
      const mapConfig = window.APP_CONFIG?.MAP || {
        DEFAULT_LAT: -2.5489, 
        DEFAULT_LON: 118.0149,
        DEFAULT_ZOOM: 5,
        TILE_PROVIDER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      };
      
      this._map = L.map('location-map').setView(
        [mapConfig.DEFAULT_LAT, mapConfig.DEFAULT_LON], 
        mapConfig.DEFAULT_ZOOM
      );
      
      L.tileLayer(mapConfig.TILE_PROVIDER, {
        attribution: mapConfig.ATTRIBUTION,
        maxZoom: 18,
      }).addTo(this._map);
      
      setTimeout(() => {
        if (this._map) {
          this._map.invalidateSize();
          console.log("Map size refreshed");
        }
      }, 500);
      
      this._setupLocationControls();
      
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
            console.log(`Location found: ${latitude}, ${longitude}`);
            this._setLocation(latitude, longitude);
            this._map.setView([latitude, longitude], 15);
            
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
            if (error.code === 1) {
              errorMessage += 'Location permission denied. Please enable location access in your browser settings.';
            } else if (error.code === 2) {
              errorMessage += 'Location information unavailable. Try again later.';
            } else if (error.code === 3) {
              errorMessage += 'Location request timed out. Check your internet connection.';
            }
            errorMessage += ' You can select a location manually on the map.';
            
            this._showError(errorMessage);
            this._showPermissionIndicator('Location access failed', 'error');
            
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
            maximumAge: 0
          }
        );
      } else {
        this._showError('Geolocation is not supported by your browser.');
      }
    });
    
    clearLocationBtn.addEventListener('click', () => {
      this._clearLocation();
    });
  }
  
  _setLocation(lat, lng) {
    if (this._marker) {
      this._map.removeLayer(this._marker);
    }
    
    this._marker = L.marker([lat, lng]).addTo(this._map);
    this._location = { lat, lon: lng };
    
    const locationText = document.getElementById('location-text');
    const locationDisplay = document.getElementById('location-display');
    const locationCoords = document.getElementById('location-coords');
    
    locationText.style.display = 'none';
    locationDisplay.style.display = 'flex';
    locationCoords.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
  
  _clearLocation() {
    if (this._marker) {
      this._map.removeLayer(this._marker);
      this._marker = null;
    }
    
    this._location = null;
    
    const locationText = document.getElementById('location-text');
    const locationDisplay = document.getElementById('location-display');
    
    locationText.style.display = 'block';
    locationDisplay.style.display = 'none';
  }
  
  _setupForm() {
    const addStoryForm = document.getElementById('add-story-form');
    
    addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.getElementById('description').value.trim();
      
      // Validate inputs
      if (!description) {
        this._showError('Please enter a description for your story');
        document.getElementById('description').focus();
        return;
      }
      
      if (description.length < 10) {
        this._showError('Story description should be at least 10 characters long');
        document.getElementById('description').focus();
        return;
      }
      
      if (!this._photoFile) {
        this._showError('Please capture or upload a photo');
        return;
      }
      
      await this._submitStory(description);
    });
  }
  
  async _submitStory(description) {
    const submitButton = document.getElementById('submit-button');
    const errorContainer = document.getElementById('error-container');
    const form = document.getElementById('add-story-form');
    
    try {
      errorContainer.innerHTML = '';
      
      // Update button state
      submitButton.innerHTML = `
        <div class="loading-spinner"></div>
        Posting Story...
      `;
      submitButton.disabled = true;
      submitButton.classList.add('loading');
      
      // Disable form
      const formElements = form.querySelectorAll('input, textarea, button');
      formElements.forEach(element => {
        if (element !== submitButton) {
          element.disabled = true;
        }
      });
      
      const auth = AuthStore.getAuth();
      
      // Prepare data for API
      const storyData = {
        token: auth.token,
        description,
        photo: this._photoFile,
      };
      
      // Add location if available
      if (this._location) {
        storyData.lat = this._location.lat;
        storyData.lon = this._location.lon;
      }
      
      // Send data to API
      const result = await StoryApi.addStory(storyData);
      
      if (result.error) {
        throw new Error(result.message);
      }
      
      // Show success message
      errorContainer.innerHTML = `
        <div class="success-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
          <p>Story posted successfully! Redirecting to home...</p>
        </div>
      `;
      
      // Update button to success state
      submitButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
        Story Posted!
      `;
      submitButton.classList.remove('loading');
      submitButton.classList.add('success');
      
      this._showPermissionIndicator('Story posted successfully!', 'success');
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.hash = '#/';
      }, 2000);
      
    } catch (error) {
      console.error('Error posting story:', error);
      this._showError(error.message || 'Failed to post story. Please try again.');
      
      // Reset button
      submitButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        </svg>
        Post Story
      `;
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      
      // Re-enable form
      const form = document.getElementById('add-story-form');
      const formElements = form.querySelectorAll('input, textarea, button');
      formElements.forEach(element => {
        element.disabled = false;
      });
      
      this._showPermissionIndicator('Failed to post story', 'error');
    }
  }
  
  _showPermissionIndicator(message, type = 'info') {
    // Remove existing indicator
    const existing = document.querySelector('.permission-indicator');
    if (existing) {
      existing.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = `permission-indicator ${type}`;
    indicator.textContent = message;
    
    document.body.appendChild(indicator);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.animation = 'slideUp 0.3s ease-in forwards';
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.remove();
          }
        }, 300);
      }
    }, 4000);
  }
  
  _showError(message) {
    const errorContainer = document.getElementById('error-container');
    
    if (!errorContainer) {
      console.error('Error container not found');
      return;
    }
    
    console.error('Error occurred:', message);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <div>
        <p>${message}</p>
      </div>
    `;
    
    errorContainer.innerHTML = '';
    errorContainer.appendChild(errorDiv);
    
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  _stopMediaStream() {
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error('Error stopping track:', e);
        }
      });
      this._mediaStream = null;
    }
  }
  
  // Clean up resources when navigating away
  async beforeDestroy() {
    this._stopMediaStream();
    
    // Clean up map if it exists
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    
    // Remove any permission indicators
    const indicator = document.querySelector('.permission-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// // import StoryApi from '../../data/api';
// // import AuthStore from '../../data/auth-store';

// // export default class AddStoryPage {
// //   constructor() {
// //     this._mediaStream = null;
// //     this._photoFile = null;
// //     this._location = null;
// //     this._map = null;
// //     this._marker = null;
// //     this._isUsingCamera = false;
// //   }
  
// //   async render() {
// //     return `
// //       <section class="add-story-page">
// //         <div class="container">
// //           <div class="add-story-container">
// //             <div class="add-story-header">
// //               <h1>Add New Story</h1>
// //               <a href="#/" class="back-button" aria-label="Back to Home">
// //                 ← Back to Home
// //               </a>
// //             </div>
            
// //             <form id="add-story-form" class="add-story-form">
// //               <div class="form-group">
// //                 <label for="description">Description</label>
// //                 <textarea 
// //                   id="description" 
// //                   name="description" 
// //                   required 
// //                   placeholder="Share your story..."
// //                   rows="4"
// //                 ></textarea>
// //               </div>
              
// //               <div class="form-group">
// //                 <label>Photo</label>
// //                 <div class="photo-input-container">
// //                   <div id="camera-container" class="camera-container">
// //                     <video id="camera-preview" class="camera-preview" autoplay playsinline style="display: none;"></video>
// //                     <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
// //                     <div id="photo-preview-container" class="photo-preview-container">
// //                       <div class="no-photo-placeholder">
// //                         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                           <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
// //                           <circle cx="12" cy="13" r="4"></circle>
// //                         </svg>
// //                         <p>No photo selected</p>
// //                       </div>
// //                       <img id="photo-preview" class="photo-preview" alt="Preview of captured photo" style="display: none;" />
// //                     </div>
// //                   </div>
                  
// //                   <div class="camera-controls">
// //                     <button type="button" id="open-camera-btn" class="camera-btn primary">
// //                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                         <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
// //                         <circle cx="12" cy="13" r="4"></circle>
// //                       </svg>
// //                       Open Camera
// //                     </button>
// //                     <button type="button" id="take-photo-btn" class="camera-btn secondary" style="display: none;">
// //                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                         <circle cx="12" cy="12" r="10"></circle>
// //                         <circle cx="12" cy="12" r="3"></circle>
// //                       </svg>
// //                       Take Photo
// //                     </button>
// //                     <button type="button" id="switch-camera-btn" class="camera-btn secondary" style="display: none;">
// //                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                         <path d="M3 2v6h6"></path>
// //                         <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
// //                         <path d="M21 22v-6h-6"></path>
// //                         <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
// //                       </svg>
// //                       Switch Camera
// //                     </button>
// //                     <button type="button" id="reset-btn" class="camera-btn reset" style="display: none;">
// //                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                         <path d="M3 6h18"></path>
// //                         <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
// //                         <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
// //                       </svg>
// //                       Reset
// //                     </button>
// //                   </div>
                  
// //                   <div class="file-upload-section">
// //                     <p>Or upload a photo:</p>
// //                     <input 
// //                       type="file" 
// //                       id="photo-upload" 
// //                       name="photo" 
// //                       accept="image/*"
// //                       aria-label="Upload a photo"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>
              
// //               <div class="form-group">
// //                 <label>Location (Optional)</label>
// //                 <div id="location-map" class="location-map"></div>
                
// //                 <div class="location-controls">
// //                   <button type="button" id="use-my-location-btn" class="location-btn">
// //                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
// //                       <circle cx="12" cy="10" r="3"></circle>
// //                     </svg>
// //                     Use My Location
// //                   </button>
                  
// //                   <div class="location-info">
// //                     <p id="location-text">Or click on the map to select a location</p>
// //                     <div id="location-display" class="location-display" style="display: none;">
// //                       <span id="location-coords"></span>
// //                       <button type="button" id="clear-location-btn" class="clear-location-btn">
// //                         Clear
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
              
// //               <div id="error-container" class="error-container"></div>
              
// //               <div class="form-actions">
// //                 <button type="submit" id="submit-button" class="submit-button">
// //                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                     <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
// //                     <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
// //                   </svg>
// //                   Post Story
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </section>
// //     `;
// //   }

// //   async afterRender() {
// //     // Add this line to debug
// //     console.log('AddStoryPage: afterRender');
    
// //     this._initialUI();
    
// //     // Check HTTPS requirement
// //     if (!this._checkHTTPS()) {
// //       return; // Don't setup camera if HTTPS is not available
// //     }
    
// //     this._setupForm();
// //     this._setupCamera();
// //     this._setupLocationMap();
// //   }
  
// //   _initialUI() {
// //     // Update active navigation link
// //     const navLinks = document.querySelectorAll('.nav-link');
// //     navLinks.forEach(link => {
// //       link.classList.remove('active');
// //       if (link.getAttribute('href') === '#/add') {
// //         link.classList.add('active');
// //       }
// //     });
    
// //     // If not logged in, redirect to login
// //     if (!AuthStore.isLoggedIn()) {
// //       window.location.hash = '#/login';
// //     }
    
// //     // Make sure photo preview container is visible
// //     const photoPreviewContainer = document.getElementById('photo-preview-container');
// //     if (photoPreviewContainer) {
// //       photoPreviewContainer.style.display = 'flex';
// //     }
// //   }
  
// //   // Check HTTPS and show warning if needed
// //   _checkHTTPS() {
// //     const errorContainer = document.getElementById('error-container');
// //     const isLocalhost = location.hostname === 'localhost' || 
// //                         location.hostname === '127.0.0.1' ||
// //                         location.hostname.includes('netlify.app'); // Allow netlify preview URLs
    
// //     if (location.protocol !== 'https:' && !isLocalhost) {
// //       errorContainer.innerHTML = `
// //         <div class="https-warning">
// //           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
// //             <line x1="12" y1="9" x2="12" y2="13"></line>
// //             <circle cx="12" cy="17" r="1"></circle>
// //           </svg>
// //           <div>
// //             <strong>HTTPS Required:</strong> Camera access requires a secure connection. 
// //             Please access this site via HTTPS or use localhost for development.
// //           </div>
// //         </div>
// //       `;
// //       return false;
// //     }
// //     return true;
// //   }
  
// //   _setupCamera() {
// //     console.log('Setting up camera...');
    
// //     const openCameraBtn = document.getElementById('open-camera-btn');
// //     const takePhotoBtn = document.getElementById('take-photo-btn');
// //     const switchCameraBtn = document.getElementById('switch-camera-btn');
// //     const resetBtn = document.getElementById('reset-btn');
// //     const cameraPreview = document.getElementById('camera-preview');
// //     const photoCanvas = document.getElementById('photo-canvas');
// //     const photoPreviewContainer = document.getElementById('photo-preview-container');
// //     const photoPreview = document.getElementById('photo-preview');
    
// //     // Ensure elements exist
// //     if (!openCameraBtn || !cameraPreview || !photoPreviewContainer) {
// //       console.error('Camera UI elements not found');
// //       this._showError('An error occurred while initializing the camera interface');
// //       return;
// //     }
    
// //     const noPhotoPlaceholder = photoPreviewContainer.querySelector('.no-photo-placeholder');
    
// //     let currentCamera = 'environment'; // Start with back camera
    
// //     // Open camera when button is clicked
// //     openCameraBtn.addEventListener('click', async () => {
// //       try {
// //         console.log('Opening camera...');
// //         // Show loading state
// //         openCameraBtn.innerHTML = `
// //           <div class="loading-spinner"></div>
// //           Requesting Camera...
// //         `;
// //         openCameraBtn.disabled = true;
        
// //         // Show permission indicator
// //         this._showPermissionIndicator('Please allow camera access when prompted');
        
// //         // Check if camera permission is supported
// //         if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
// //           throw new Error('Camera is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
// //         }
        
// //         // Debugging info - check all available devices
// //         try {
// //           const devices = await navigator.mediaDevices.enumerateDevices();
// //           const videoDevices = devices.filter(device => device.kind === 'videoinput');
// //           console.log('Available video devices:', videoDevices.length);
// //           videoDevices.forEach((device, index) => {
// //             console.log(`Camera #${index + 1}: ${device.label || 'Unnamed camera'}`);
// //           });
// //         } catch (enumError) {
// //           console.log('Could not enumerate devices:', enumError);
// //         }
        
// //         // Check current permission status
// //         if (navigator.permissions) {
// //           try {
// //             const permission = await navigator.permissions.query({ name: 'camera' });
// //             console.log('Camera permission status:', permission.state);
            
// //             if (permission.state === 'denied') {
// //               throw new Error('Camera access has been denied. Please enable camera permission in your browser settings and refresh the page.');
// //             }
// //           } catch (permError) {
// //             console.log('Permission API not fully supported, proceeding with direct request');
// //           }
// //         }
        
// //         // Request camera access - this will trigger the permission dialog
// //         await this._startCamera(currentCamera);
        
// //         // Update UI on success
// //         cameraPreview.style.display = 'block';
// //         if (noPhotoPlaceholder) {
// //           noPhotoPlaceholder.style.display = 'none';
// //         }
// //         photoPreview.style.display = 'none';
        
// //         // Show camera controls
// //         openCameraBtn.style.display = 'none';
// //         takePhotoBtn.style.display = 'inline-flex';
// //         switchCameraBtn.style.display = 'inline-flex';
// //         resetBtn.style.display = 'inline-flex';
        
// //         this._isUsingCamera = true;
        
// //         // Show success indicator
// //         this._showPermissionIndicator('Camera access granted!', 'success');
        
// //       } catch (error) {
// //         console.error('Error accessing camera:', error);
        
// //         // Reset button state
// //         openCameraBtn.innerHTML = `
// //           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //             <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
// //             <circle cx="12" cy="13" r="4"></circle>
// //           </svg>
// //           Open Camera
// //         `;
// //         openCameraBtn.disabled = false;
        
// //         // Show detailed error message based on error type
// //         let errorMessage = 'Unable to access camera. ';
        
// //         if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
// //           errorMessage += 'Camera permission was denied. Please click "Allow" when prompted or enable camera access in your browser settings.';
// //           this._showCameraPermissionHelp();
// //           this._showPermissionIndicator('Camera permission denied', 'error');
// //         } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
// //           errorMessage += 'No camera found on this device.';
// //           this._showPermissionIndicator('No camera found', 'error');
// //         } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
// //           errorMessage += 'Camera is already in use by another application.';
// //           this._showPermissionIndicator('Camera in use by another app', 'error');
// //         } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
// //           errorMessage += 'Camera does not support the requested settings.';
// //         } else if (error.name === 'NotSupportedError') {
// //           errorMessage += 'Camera is not supported in this browser.';
// //         } else if (error.name === 'SecurityError') {
// //           errorMessage += 'Camera access blocked due to security restrictions. Please use HTTPS.';
// //         } else {
// //           errorMessage += error.message || 'Please try using the file upload option instead.';
// //         }
        
// //         this._showError(errorMessage);
// //       }
// //     });
    
// //     // Take photo when button is clicked
// //     takePhotoBtn.addEventListener('click', () => {
// //       try {
// //         console.log('Taking photo...');
        
// //         if (!this._mediaStream) {
// //           throw new Error('Camera is not active. Please restart the camera.');
// //         }
        
// //         this._capturePhoto();
        
// //         // Hide camera, show photo preview
// //         cameraPreview.style.display = 'none';
// //         photoPreview.style.display = 'block';
// //         if (noPhotoPlaceholder) {
// //           noPhotoPlaceholder.style.display = 'none';
// //         }
        
// //         // Update button states
// //         takePhotoBtn.style.display = 'none';
// //         switchCameraBtn.style.display = 'none';
        
// //         // Stop camera stream
// //         this._stopMediaStream();
// //         this._isUsingCamera = false;
        
// //         this._showPermissionIndicator('Photo captured!', 'success');
// //       } catch (error) {
// //         console.error('Error capturing photo:', error);
// //         this._showError('Failed to capture photo: ' + error.message);
// //       }
// //     });
    
// //     // Switch camera (front/back)
// //     switchCameraBtn.addEventListener('click', async () => {
// //       currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
      
// //       switchCameraBtn.innerHTML = `
// //         <div class="loading-spinner"></div>
// //         Switching...
// //       `;
// //       switchCameraBtn.disabled = true;
      
// //       try {
// //         this._stopMediaStream();
// //         await this._startCamera(currentCamera);
        
// //         switchCameraBtn.innerHTML = `
// //           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //             <path d="M3 2v6h6"></path>
// //             <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
// //             <path d="M21 22v-6h-6"></path>
// //             <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
// //           </svg>
// //           Switch Camera
// //         `;
// //         switchCameraBtn.disabled = false;
        
// //         const cameraType = currentCamera === 'environment' ? 'Back' : 'Front';
// //         this._showPermissionIndicator(`Switched to ${cameraType} camera`, 'success');
// //       } catch (error) {
// //         console.error('Error switching camera:', error);
// //         this._showError('Unable to switch camera. Using current camera.');
        
// //         switchCameraBtn.innerHTML = `
// //           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //             <path d="M3 2v6h6"></path>
// //             <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
// //             <path d="M21 22v-6h-6"></path>
// //             <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
// //           </svg>
// //           Switch Camera
// //         `;
// //         switchCameraBtn.disabled = false;
// //       }
// //     });
    
// //     // Reset/clear photo
// //     resetBtn.addEventListener('click', () => {
// //       this._resetCamera();
// //     });
    
// //     // Handle file upload
// //     const photoUpload = document.getElementById('photo-upload');
// //     photoUpload.addEventListener('change', (event) => {
// //       if (event.target.files && event.target.files[0]) {
// //         this._handleFileUpload(event.target.files[0]);
// //       }
// //     });
// //   }
  
// //   // Enhanced startCamera method with better error handling
// //  async _startCamera(facingMode) {
// //   console.log(`Starting camera with facingMode: ${facingMode}`);
  
// //   // Menggunakan konfigurasi dari window.APP_CONFIG.CAMERA
// //   const cameraConfig = window.APP_CONFIG?.CAMERA || {
// //     DEFAULT_WIDTH: 640,
// //     DEFAULT_HEIGHT: 480,
// //     PHOTO_QUALITY: 0.8
// //   };
  
// //   // Try different constraint configurations for better compatibility
// //   const constraints = [
// //     // First try: basic video
// //     {
// //       video: true,
// //       audio: false,
// //     },
// //     // Second try: with facingMode
// //     {
// //       video: { facingMode },
// //       audio: false,
// //     },
// //     // Third try: facingMode with configured resolution
// //     {
// //       video: { 
// //         facingMode,
// //         width: { ideal: cameraConfig.DEFAULT_WIDTH },
// //         height: { ideal: cameraConfig.DEFAULT_HEIGHT }
// //       },
// //       audio: false,
// //     },
// //     // Fourth try: facingMode with lower resolution
// //     {
// //       video: { 
// //         facingMode,
// //         width: { ideal: 320 },
// //         height: { ideal: 240 }
// //       },
// //       audio: false,
// //     }
// //   ];
  
// //   let lastError;
  
// //   for (let i = 0; i < constraints.length; i++) {
// //     try {
// //       console.log(`Trying camera constraint ${i + 1}:`, constraints[i]);
// //       this._mediaStream = await navigator.mediaDevices.getUserMedia(constraints[i]);
      
// //       const cameraPreview = document.getElementById('camera-preview');
// //       if (!cameraPreview) {
// //         throw new Error('Camera preview element not found');
// //       }
      
// //       // Set the stream as the source of the video element
// //       cameraPreview.srcObject = this._mediaStream;
      
// //       // Log when video metadata is loaded
// //       console.log('Video metadata loaded, camera ready');
      
// //       // Wait for video to load
// //       return new Promise((resolve, reject) => {
// //         cameraPreview.onloadedmetadata = () => {
// //           console.log('Camera started successfully', cameraPreview.videoWidth, 'x', cameraPreview.videoHeight);
// //           // Wait a bit more for video to start playing
// //           setTimeout(() => {
// //             resolve();
// //           }, 500);
// //         };
        
// //         cameraPreview.onerror = (error) => {
// //           console.error('Video element error:', error);
// //           reject(new Error('Failed to display camera feed'));
// //         };
        
// //         // Timeout after 10 seconds
// //         setTimeout(() => {
// //           reject(new Error('Camera initialization timeout'));
// //         }, 10000);
// //       });
      
// //     } catch (error) {
// //       console.error(`Camera constraint ${i + 1} failed:`, error);
// //       lastError = error;
      
// //       if (i === constraints.length - 1) {
// //         // All constraints failed, throw the last error
// //         throw lastError;
// //       }
// //     }
// //   }
// // }
  
// //   _capturePhoto() {
// //     console.log('Capturing photo');
// //     const cameraPreview = document.getElementById('camera-preview');
// //     const photoCanvas = document.getElementById('photo-canvas');
// //     const photoPreview = document.getElementById('photo-preview');
    
// //     if (!cameraPreview || !photoCanvas || !photoPreview) {
// //       throw new Error('Required photo elements not found');
// //     }
    
// //     // Check if video is ready
// //     if (!cameraPreview.videoWidth) {
// //       throw new Error('Camera video is not ready yet');
// //     }
    
// //     // Set canvas dimensions to match video
// //     photoCanvas.width = cameraPreview.videoWidth;
// //     photoCanvas.height = cameraPreview.videoHeight;
    
// //     console.log(`Canvas dimensions set to ${photoCanvas.width}x${photoCanvas.height}`);
    
// //     try {
// //       // Draw video frame to canvas
// //       const context = photoCanvas.getContext('2d');
// //       context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
      
// //       console.log('Image drawn to canvas');
      
// //       // Convert canvas to blob
// //       photoCanvas.toBlob((blob) => {
// //         if (!blob) {
// //           throw new Error('Failed to create image blob');
// //         }
        
// //         console.log(`Photo blob created: ${blob.size} bytes`);
        
// //         // Create a File object from the blob
// //         this._photoFile = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
// //         // Display the captured photo
// //         const photoUrl = URL.createObjectURL(blob);
// //         photoPreview.src = photoUrl;
// //         photoPreview.onload = () => {
// //           console.log('Photo preview loaded successfully');
// //         };
// //       }, 'image/jpeg', 0.8);
// //     } catch (error) {
// //       console.error('Error capturing photo:', error);
// //       throw new Error('Failed to capture photo: ' + error.message);
// //     }
// //   }
  
// //   _handleFileUpload(file) {
// //     // Validate file type
// //     if (!file.type.startsWith('image/')) {
// //       this._showError('Please select a valid image file.');
// //       return;
// //     }
    
// //     // Validate file size (max 1MB as per API requirement)
// //     if (file.size > 1024 * 1024) {
// //       this._showError('Image file size must be less than 1MB.');
// //       return;
// //     }
    
// //     this._photoFile = file;
    
// //     // Display the selected photo
// //     const photoUrl = URL.createObjectURL(file);
// //     const photoPreview = document.getElementById('photo-preview');
// //     const noPhotoPlaceholder = document.querySelector('.no-photo-placeholder');
    
// //     if (!photoPreview) {
// //       this._showError('Photo preview element not found');
// //       return;
// //     }
    
// //     photoPreview.src = photoUrl;
// //     photoPreview.style.display = 'block';
    
// //     if (noPhotoPlaceholder) {
// //       noPhotoPlaceholder.style.display = 'none';
// //     }
    
// //     // Show reset button
// //     document.getElementById('reset-btn').style.display = 'inline-flex';
// //     document.getElementById('open-camera-btn').style.display = 'none';
    
// //     // Stop camera if running
// //     if (this._isUsingCamera) {
// //       this._stopMediaStream();
// //       document.getElementById('camera-preview').style.display = 'none';
// //       document.getElementById('take-photo-btn').style.display = 'none';
// //       document.getElementById('switch-camera-btn').style.display = 'none';
// //       this._isUsingCamera = false;
// //     }
    
// //     this._showPermissionIndicator('Photo uploaded successfully!', 'success');
// //   }
  
// //   _resetCamera() {
// //     // Clear photo
// //     this._photoFile = null;
    
// //     // Reset UI
// //     const photoPreview = document.getElementById('photo-preview');
// //     const noPhotoPlaceholder = document.querySelector('.no-photo-placeholder');
// //     const cameraPreview = document.getElementById('camera-preview');
    
// //     if (photoPreview) {
// //       photoPreview.src = '';
// //       photoPreview.style.display = 'none';
// //     }
    
// //     if (cameraPreview) {
// //       cameraPreview.style.display = 'none';
// //     }
    
// //     if (noPhotoPlaceholder) {
// //       noPhotoPlaceholder.style.display = 'block';
// //     }
    
// //     // Reset buttons
// //     const openCameraBtn = document.getElementById('open-camera-btn');
// //     const takePhotoBtn = document.getElementById('take-photo-btn');
// //     const switchCameraBtn = document.getElementById('switch-camera-btn');
// //     const resetBtn = document.getElementById('reset-btn');
    
// //     if (openCameraBtn) openCameraBtn.style.display = 'inline-flex';
// //     if (takePhotoBtn) takePhotoBtn.style.display = 'none';
// //     if (switchCameraBtn) switchCameraBtn.style.display = 'none';
// //     if (resetBtn) resetBtn.style.display = 'none';
    
// //     // Clear file input
// //     const photoUpload = document.getElementById('photo-upload');
// //     if (photoUpload) photoUpload.value = '';
    
// //     // Stop camera stream
// //     this._stopMediaStream();
// //     this._isUsingCamera = false;
    
// //     // Clear any error messages
// //     const errorContainer = document.getElementById('error-container');
// //     if (errorContainer) errorContainer.innerHTML = '';
// //   }
  
// //   _setupLocationMap() {
// //     console.log('Setting up location map...');
    
// //     // Load Leaflet CSS and JS
// //     if (!document.querySelector('link[href*="leaflet"]')) {
// //       const leafletCSS = document.createElement('link');
// //       leafletCSS.rel = 'stylesheet';
// //       leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
// //       document.head.appendChild(leafletCSS);
// //     }
    
// //     if (!window.L) {
// //       const leafletScript = document.createElement('script');
// //       leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
// //       document.head.appendChild(leafletScript);
      
// //       leafletScript.onload = () => {
// //         console.log('Leaflet loaded successfully');
// //         this._initMap();
// //       };
      
// //       leafletScript.onerror = () => {
// //         console.error('Failed to load Leaflet');
// //         document.getElementById('location-map').innerHTML = `
// //           <div class="map-error">
// //             <p>Unable to load map. Please check your internet connection.</p>
// //           </div>
// //         `;
// //       };
// //     } else {
// //       this._initMap();
// //     }
// //   }
  
// //  _initMap() {
// //   try {
// //     console.log('Initializing map...');
    
// //     // Menggunakan konfigurasi dari window.APP_CONFIG.MAP
// //     const mapConfig = window.APP_CONFIG?.MAP || {
// //       DEFAULT_LAT: -2.5489, 
// //       DEFAULT_LON: 118.0149,
// //       DEFAULT_ZOOM: 5,
// //       TILE_PROVIDER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
// //       ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //     };
    
// //     // Create map centered at Indonesia
// //     this._map = L.map('location-map').setView(
// //       [mapConfig.DEFAULT_LAT, mapConfig.DEFAULT_LON], 
// //       mapConfig.DEFAULT_ZOOM
// //     );
    
// //     // Add tile layer (OpenStreetMap)
// //     L.tileLayer(mapConfig.TILE_PROVIDER, {
// //       attribution: mapConfig.ATTRIBUTION,
// //       maxZoom: 18,
// //     }).addTo(this._map);
    
// //     // Fix map size after it's rendered - increase timeout
// //     setTimeout(() => {
// //       if (this._map) {
// //         this._map.invalidateSize();
// //         console.log("Map size refreshed");
// //       }
// //     }, 500); // Longer timeout
    
// //     // Setup location controls
// //     this._setupLocationControls();
    
// //     // Add click event to the map
// //     this._map.on('click', (event) => {
// //       this._setLocation(event.latlng.lat, event.latlng.lng);
// //     });
    
// //   } catch (error) {
// //     console.error('Error initializing map:', error);
// //     document.getElementById('location-map').innerHTML = `
// //       <div class="map-error">
// //         <p>Error loading map. Location selection is optional.</p>
// //       </div>
// //     `;
// //   }
// // }
  
// //   _setupLocationControls() {
// //     const useMyLocationBtn = document.getElementById('use-my-location-btn');
// //     const clearLocationBtn = document.getElementById('clear-location-btn');
    
// //     // Use my location button
// //     useMyLocationBtn.addEventListener('click', () => {
// //       if ('geolocation' in navigator) {
// //         useMyLocationBtn.innerHTML = `
// //           <div class="loading-spinner"></div>
// //           Getting location...
// //         `;
// //         useMyLocationBtn.disabled = true;
        
// //         this._showPermissionIndicator('Getting your location...');
        
// //         navigator.geolocation.getCurrentPosition(
// //           // Success callback
// //           (position) => {
// //             const { latitude, longitude } = position.coords;
// //             console.log(`Location found: ${latitude}, ${longitude}`);
// //             this._setLocation(latitude, longitude);
// //             this._map.setView([latitude, longitude], 15);
            
// //             // Reset button
// //             useMyLocationBtn.innerHTML = `
// //               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
// //                 <circle cx="12" cy="10" r="3"></circle>
// //               </svg>
// //               Use My Location
// //             `;
// //             useMyLocationBtn.disabled = false;
            
// //             this._showPermissionIndicator('Location found!', 'success');
// //           },
// //           // Error callback
// //           (error) => {
// //             console.error('Geolocation error:', error);
            
// //             let errorMessage = 'Unable to get your location. ';
// //             if (error.code === 1) { // PERMISSION_DENIED
// //               errorMessage += 'Location permission denied. Please enable location access in your browser settings.';
// //             } else if (error.code === 2) { // POSITION_UNAVAILABLE
// //               errorMessage += 'Location information unavailable. Try again later.';
// //             } else if (error.code === 3) { // TIMEOUT
// //               errorMessage += 'Location request timed out. Check your internet connection.';
// //             }
// //             errorMessage += ' You can select a location manually on the map.';
            
// //             this._showError(errorMessage);
// //             this._showPermissionIndicator('Location access failed', 'error');
            
// //             // Reset button
// //             useMyLocationBtn.innerHTML = `
// //               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
// //                 <circle cx="12" cy="10" r="3"></circle>
// //               </svg>
// //               Use My Location
// //             `;
// //             useMyLocationBtn.disabled = false;
// //           },
// //           // Options
// //           { 
// //             enableHighAccuracy: true, 
// //             timeout: 10000, 
// //             maximumAge: 0 // Don't use cached position
// //           }
// //         );
// //       } else {
// //         this._showError('Geolocation is not supported by your browser.');
// //       }
// //     });
    
// //     // Clear location button
// //     clearLocationBtn.addEventListener('click', () => {
// //       this._clearLocation();
// //     });
// //   }
  
// //   _setLocation(lat, lng) {
// //     // Remove existing marker
// //     if (this._marker) {
// //       this._map.removeLayer(this._marker);
// //     }
    
// //     // Add new marker
// //     this._marker = L.marker([lat, lng]).addTo(this._map);
    
// //     // Update location data
// //     this._location = { lat, lon: lng };
    
// //     // Update UI
// //     const locationText = document.getElementById('location-text');
// //     const locationDisplay = document.getElementById('location-display');
// //     const locationCoords = document.getElementById('location-coords');
    
// //     locationText.style.display = 'none';
// //     locationDisplay.style.display = 'flex';
// //     locationCoords.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
// //   }
  
// //   _clearLocation() {
// //     // Remove marker
// //     if (this._marker) {
// //       this._map.removeLayer(this._marker);
// //       this._marker = null;
// //     }
    
// //     // Clear location data
// //     this._location = null;
    
// //     // Update UI
// //     const locationText = document.getElementById('location-text');
// //     const locationDisplay = document.getElementById('location-display');
    
// //     locationText.style.display = 'block';
// //     locationDisplay.style.display = 'none';
// //   }
  
// //   _setupForm() {
// //     const addStoryForm = document.getElementById('add-story-form');
    
// //     addStoryForm.addEventListener('submit', async (event) => {
// //       event.preventDefault();
      
// //       const description = document.getElementById('description').value.trim();
      
// //       // Validate inputs
// //       if (!description) {
// //         this._showError('Please enter a description for your story');
// //         document.getElementById('description').focus();
// //         return;
// //       }
      
// //       if (description.length < 10) {
// //         this._showError('Story description should be at least 10 characters long');
// //         document.getElementById('description').focus();
// //         return;
// //       }
      
// //       if (!this._photoFile) {
// //         this._showError('Please capture or upload a photo');
// //         return;
// //       }
      
// //       await this._submitStory(description);
// //     });
// //   }
  
// //   async _submitStory(description) {
// //     const submitButton = document.getElementById('submit-button');
// //     const errorContainer = document.getElementById('error-container');
// //     const form = document.getElementById('add-story-form');
    
// //     try {
// //       errorContainer.innerHTML = '';
      
// //       // Update button state
// //       submitButton.innerHTML = `
// //         <div class="loading-spinner"></div>
// //         Posting Story...
// //       `;
// //       submitButton.disabled = true;
// //       submitButton.classList.add('loading');
      
// //       // Disable form
// //       const formElements = form.querySelectorAll('input, textarea, button');
// //       formElements.forEach(element => {
// //         if (element !== submitButton) {
// //           element.disabled = true;
// //         }
// //       });
      
// //       const auth = AuthStore.getAuth();
      
// //       // Prepare data for API
// //       const storyData = {
// //         token: auth.token,
// //         description,
// //         photo: this._photoFile,
// //       };
      
// //       // Add location if available
// //       if (this._location) {
// //         storyData.lat = this._location.lat;
// //         storyData.lon = this._location.lon;
// //       }
      
// //       // Send data to API
// //       const result = await StoryApi.addStory(storyData);
      
// //       if (result.error) {
// //         throw new Error(result.message);
// //       }
      
// //       // Show success message
// //       errorContainer.innerHTML = `
// //         <div class="success-message">
// //           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
// //             <polyline points="22,4 12,14.01 9,11.01"></polyline>
// //           </svg>
// //           <p>Story posted successfully! Redirecting to home...</p>
// //         </div>
// //       `;
      
// //       // Update button to success state
// //       submitButton.innerHTML = `
// //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
// //           <polyline points="22,4 12,14.01 9,11.01"></polyline>
// //         </svg>
// //         Story Posted!
// //       `;
// //       submitButton.classList.remove('loading');
// //       submitButton.classList.add('success');
      
// //       this._showPermissionIndicator('Story posted successfully!', 'success');
      
// //       // Redirect to home page after 2 seconds
// //       setTimeout(() => {
// //         window.location.hash = '#/';
// //       }, 2000);
      
// //     } catch (error) {
// //       console.error('Error posting story:', error);
// //       this._showError(error.message || 'Failed to post story. Please try again.');
      
// //       // Reset button
// //       submitButton.innerHTML = `
// //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //           <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
// //           <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
// //         </svg>
// //         Post Story
// //       `;
// //       submitButton.disabled = false;
// //       submitButton.classList.remove('loading');
      
// //       // Re-enable form
// //       const form = document.getElementById('add-story-form');
// //       const formElements = form.querySelectorAll('input, textarea, button');
// //       formElements.forEach(element => {
// //         element.disabled = false;
// //       });
      
// //       this._showPermissionIndicator('Failed to post story', 'error');
// //     }
// //   }
  
// //   // Show camera permission help
// //   _showCameraPermissionHelp() {
// //     const errorContainer = document.getElementById('error-container');
    
// //     if (!errorContainer) {
// //       console.error('Error container not found');
// //       return;
// //     }
    
// //     const isChrome = /Chrome/.test(navigator.userAgent);
// //     const isFirefox = /Firefox/.test(navigator.userAgent);
// //     const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
// //     const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
// //     let helpText = '';
    
// //     if (isMobile) {
// //       helpText = `
// //         <div class="permission-help">
// //           <h4>How to enable camera on your mobile device:</h4>
// //           <ol>
// //             <li>Check your browser settings</li>
// //             <li>Go to your device settings &gt; Privacy &gt; Camera</li>
// //             <li>Make sure your browser is allowed to access the camera</li>
// //             <li>Refresh the page and try again</li>
// //           </ol>
// //         </div>
// //       `;
// //     } else if (isChrome) {
// //       helpText = `
// //         <div class="permission-help">
// //           <h4>How to enable camera in Chrome:</h4>
// //           <ol>
// //             <li>Click the camera icon in the address bar</li>
// //             <li>Select "Always allow" for camera access</li>
// //             <li>Refresh the page and try again</li>
// //           </ol>
// //           <p>Or go to Settings → Privacy and security → Site Settings → Camera</p>
// //         </div>
// //       `;
// //     } else if (isFirefox) {
// //       helpText = `
// //         <div class="permission-help">
// //           <h4>How to enable camera in Firefox:</h4>
// //           <ol>
// //             <li>Click the shield icon in the address bar</li>
// //             <li>Turn off "Enhanced Tracking Protection" for this site</li>
// //             <li>Or click the camera icon and select "Allow"</li>
// //           </ol>
// //         </div>
// //       `;
// //     } else if (isSafari) {
// //       helpText = `
// //         <div class="permission-help">
// //           <h4>How to enable camera in Safari:</h4>
// //           <ol>
// //             <li>Go to Safari → Preferences → Websites</li>
// //             <li>Select "Camera" from the list</li>
// //             <li>Set this website to "Allow"</li>
// //           </ol>
// //         </div>
// //       `;
// //     } else {
// //       helpText = `
// //         <div class="permission-help">
// //           <h4>Camera Permission Required:</h4>
// //           <p>Please allow camera access when prompted by your browser, then try again.</p>
// //         </div>
// //       `;
// //     }
    
// //     errorContainer.innerHTML += helpText;
// //   }
  
// //   // Show permission indicator
// //   _showPermissionIndicator(message, type = 'info') {
// //     // Remove existing indicator
// //     const existing = document.querySelector('.permission-indicator');
// //     if (existing) {
// //       existing.remove();
// //     }
    
// //     const indicator = document.createElement('div');
// //     indicator.className = `permission-indicator ${type}`;
// //     indicator.textContent = message;
    
// //     document.body.appendChild(indicator);
    
// //     // Auto remove after 4 seconds
// //     setTimeout(() => {
// //       if (indicator.parentNode) {
// //         indicator.style.animation = 'slideUp 0.3s ease-in forwards';
// //         setTimeout(() => {
// //           if (indicator.parentNode) {
// //             indicator.remove();
// //           }
// //         }, 300);
// //       }
// //     }, 4000);
// //   }
  
// //   // Enhanced error showing with better UX
// //   _showError(message) {
// //     const errorContainer = document.getElementById('error-container');
    
// //     if (!errorContainer) {
// //       console.error('Error container not found');
// //       return;
// //     }
    
// //     console.error('Error occurred:', message);
    
// //     // Create error element
// //     const errorDiv = document.createElement('div');
// //     errorDiv.className = 'error-message';
// //     errorDiv.innerHTML = `
// //       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
// //         <circle cx="12" cy="12" r="10"></circle>
// //         <line x1="15" y1="9" x2="9" y2="15"></line>
// //         <line x1="9" y1="9" x2="15" y2="15"></line>
// //       </svg>
// //       <div>
// //         <p>${message}</p>
// //         ${message.includes('permission') ? '<p><small>💡 Tip: Look for a camera icon in your browser\'s address bar</small></p>' : ''}
// //       </div>
// //     `;
    
// //     // Clear previous errors and add new one
// //     errorContainer.innerHTML = '';
// //     errorContainer.appendChild(errorDiv);
    
// //     // Scroll to error message
// //     errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
// //     // Auto-hide non-critical errors after 10 seconds
// //     if (!message.includes('permission') && !message.includes('denied')) {
// //       setTimeout(() => {
// //         if (errorDiv.parentNode) {
// //           errorDiv.style.opacity = '0.5';
// //         }
// //       }, 10000);
// //     }
// //   }
  
// //   _stopMediaStream() {
// //     if (this._mediaStream) {
// //       this._mediaStream.getTracks().forEach(track => {
// //         try {
// //           track.stop();
// //         } catch (e) {
// //           console.error('Error stopping track:', e);
// //         }
// //       });
// //       this._mediaStream = null;
// //     }
// //   }
  
// //   // Clean up resources when navigating away
// //   async beforeDestroy() {
// //     this._stopMediaStream();
    
// //     // Clean up map if it exists
// //     if (this._map) {
// //       this._map.remove();
// //       this._map = null;
// //     }
    
// //     // Remove any permission indicators
// //     const indicator = document.querySelector('.permission-indicator');
// //     if (indicator) {
// //       indicator.remove();
// //     }
// //   }
// // }

// import StoryApi from '../../data/api';
// import AuthStore from '../../data/auth-store';

// export default class AddStoryPage {
//   constructor() {
//     this._mediaStream = null;
//     this._photoFile = null;
//     this._location = null;
//     this._map = null;
//     this._marker = null;
//     this._isUsingCamera = false;
//     this._currentFacingMode = 'environment';
//   }
  
//   async render() {
//     return `
//       <section class="add-story-page">
//         <div class="container">
//           <div class="add-story-container">
//             <div class="add-story-header">
//               <h1>Add New Story</h1>
//               <a href="#/" class="back-button" aria-label="Back to Home">
//                 ← Back to Home
//               </a>
//             </div>
            
//             <form id="add-story-form" class="add-story-form">
//               <div class="form-group">
//                 <label for="description">Description</label>
//                 <textarea 
//                   id="description" 
//                   name="description" 
//                   required 
//                   placeholder="Share your story..."
//                   rows="4"
//                 ></textarea>
//               </div>
              
//               <div class="form-group">
//                 <label>Photo</label>
//                 <div class="photo-input-container">
                  
//                   <!-- Enhanced Camera Interface -->
//                   <div id="camera-interface" class="camera-interface">
//                     <div class="camera-main">
//                       <!-- Permission Request Screen -->
//                       <div id="permission-screen" class="permission-screen active">
//                         <div class="permission-content">
//                           <div class="camera-icon">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
//                               <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
//                               <circle cx="12" cy="13" r="4"></circle>
//                             </svg>
//                           </div>
//                           <h3>Camera Access Needed</h3>
//                           <p>Allow camera access to take photos for your story</p>
//                           <button type="button" id="request-camera-btn" class="request-camera-btn">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                               <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
//                               <circle cx="12" cy="13" r="4"></circle>
//                             </svg>
//                             Open Camera
//                           </button>
//                         </div>
//                       </div>

//                       <!-- Camera View Screen -->
//                       <div id="camera-view" class="camera-view">
//                         <video id="camera-preview" class="camera-preview" autoplay playsinline muted></video>
//                         <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
                        
//                         <!-- Camera Overlay UI -->
//                         <div class="camera-overlay">
//                           <div class="camera-top-bar">
//                             <button type="button" id="close-camera-btn" class="camera-control-btn close-btn">
//                               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                                 <line x1="6" y1="6" x2="18" y2="18"></line>
//                               </svg>
//                             </button>
//                             <div class="camera-status">
//                               <div class="recording-indicator"></div>
//                               <span>Camera Active</span>
//                             </div>
//                           </div>
                          
//                           <div class="camera-bottom-bar">
//                             <button type="button" id="switch-camera-btn" class="camera-control-btn switch-btn">
//                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                 <path d="M3 2v6h6"></path>
//                                 <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
//                                 <path d="M21 22v-6h-6"></path>
//                                 <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
//                               </svg>
//                             </button>
                            
//                             <button type="button" id="capture-btn" class="capture-btn">
//                               <div class="capture-ring">
//                                 <div class="capture-inner"></div>
//                               </div>
//                             </button>
                            
//                             <button type="button" id="gallery-btn" class="camera-control-btn gallery-btn">
//                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                                 <circle cx="8.5" cy="8.5" r="1.5"></circle>
//                                 <polyline points="21,15 16,10 5,21"></polyline>
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       <!-- Photo Preview Screen -->
//                       <div id="photo-result" class="photo-result">
//                         <img id="captured-photo" class="captured-photo" alt="Captured photo" />
//                         <div class="photo-actions">
//                           <button type="button" id="retake-btn" class="action-btn secondary">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                               <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
//                               <path d="M21 3v5h-5"></path>
//                               <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
//                               <path d="M3 21v-5h5"></path>
//                             </svg>
//                             Retake
//                           </button>
//                           <button type="button" id="use-photo-btn" class="action-btn primary">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                               <polyline points="20,6 9,17 4,12"></polyline>
//                             </svg>
//                             Use Photo
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <!-- File Upload Alternative -->
//                   <div class="file-upload-section">
//                     <div class="upload-divider">
//                       <span>Or upload from gallery</span>
//                     </div>
//                     <input 
//                       type="file" 
//                       id="photo-upload" 
//                       name="photo" 
//                       accept="image/*"
//                       aria-label="Upload a photo"
//                     />
//                   </div>
//                 </div>
//               </div>
              
//               <div class="form-group">
//                 <label>Location (Optional)</label>
//                 <div id="location-map" class="location-map"></div>
                
//                 <div class="location-controls">
//                   <button type="button" id="use-my-location-btn" class="location-btn">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                       <circle cx="12" cy="10" r="3"></circle>
//                     </svg>
//                     Use My Location
//                   </button>
                  
//                   <div class="location-info">
//                     <p id="location-text">Or click on the map to select a location</p>
//                     <div id="location-display" class="location-display" style="display: none;">
//                       <span id="location-coords"></span>
//                       <button type="button" id="clear-location-btn" class="clear-location-btn">
//                         Clear
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div id="error-container" class="error-container"></div>
              
//               <div class="form-actions">
//                 <button type="submit" id="submit-button" class="submit-button">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                     <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
//                     <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
//                   </svg>
//                   Post Story
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>
//     `;
//   }

//   async afterRender() {
//     console.log('AddStoryPage: afterRender');
    
//     this._initialUI();
//     this._setupForm();
//     this._setupCamera();
//     this._setupLocationMap();
//   }
  
//   _initialUI() {
//     // Update active navigation link
//     const navLinks = document.querySelectorAll('.nav-link');
//     navLinks.forEach(link => {
//       link.classList.remove('active');
//       if (link.getAttribute('href') === '#/add') {
//         link.classList.add('active');
//       }
//     });
    
//     // If not logged in, redirect to login
//     if (!AuthStore.isLoggedIn()) {
//       window.location.hash = '#/login';
//     }
//   }
  
//   _setupCamera() {
//     console.log('Setting up enhanced camera...');
    
//     // Get camera elements
//     const permissionScreen = document.getElementById('permission-screen');
//     const cameraView = document.getElementById('camera-view');
//     const photoResult = document.getElementById('photo-result');
//     const requestCameraBtn = document.getElementById('request-camera-btn');
//     const closeCameraBtn = document.getElementById('close-camera-btn');
//     const switchCameraBtn = document.getElementById('switch-camera-btn');
//     const captureBtn = document.getElementById('capture-btn');
//     const retakeBtn = document.getElementById('retake-btn');
//     const usePhotoBtn = document.getElementById('use-photo-btn');
//     const galleryBtn = document.getElementById('gallery-btn');
//     const cameraPreview = document.getElementById('camera-preview');
//     const capturedPhoto = document.getElementById('captured-photo');
    
//     // Request camera permission and open camera
//     requestCameraBtn.addEventListener('click', async () => {
//       try {
//         await this._requestCameraPermission();
//         this._showCameraView();
//       } catch (error) {
//         console.error('Camera permission error:', error);
//         this._showError(this._getCameraErrorMessage(error));
//       }
//     });
    
//     // Close camera
//     closeCameraBtn.addEventListener('click', () => {
//       this._closeCameraView();
//     });
    
//     // Switch camera (front/back)
//     switchCameraBtn.addEventListener('click', async () => {
//       await this._switchCamera();
//     });
    
//     // Capture photo
//     captureBtn.addEventListener('click', () => {
//       this._capturePhoto();
//     });
    
//     // Retake photo
//     retakeBtn.addEventListener('click', () => {
//       this._retakePhoto();
//     });
    
//     // Use captured photo
//     usePhotoBtn.addEventListener('click', () => {
//       this._usePhoto();
//     });
    
//     // Open gallery (file upload)
//     galleryBtn.addEventListener('click', () => {
//       document.getElementById('photo-upload').click();
//     });
    
//     // Handle file upload
//     const photoUpload = document.getElementById('photo-upload');
//     photoUpload.addEventListener('change', (event) => {
//       if (event.target.files && event.target.files[0]) {
//         this._handleFileUpload(event.target.files[0]);
//       }
//     });
//   }
  
//   async _requestCameraPermission() {
//     console.log('Requesting camera permission...');
    
//     // Update button to loading state
//     const requestBtn = document.getElementById('request-camera-btn');
//     requestBtn.innerHTML = `
//       <div class="loading-spinner"></div>
//       Requesting Permission...
//     `;
//     requestBtn.disabled = true;
    
//     // Check if running in secure context
//     if (!window.isSecureContext) {
//       throw new Error('Camera requires HTTPS or localhost');
//     }
    
//     // Check browser support
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       throw new Error('Camera not supported in this browser');
//     }
    
//     // Show permission help
//     this._showPermissionIndicator('Please allow camera access when prompted', 'info');
    
//     try {
//       // Request camera permission
//       this._mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: this._currentFacingMode,
//           width: { ideal: 640 },
//           height: { ideal: 480 }
//         },
//         audio: false
//       });
      
//       // Set up video stream
//       const cameraPreview = document.getElementById('camera-preview');
//       cameraPreview.srcObject = this._mediaStream;
      
//       // Wait for video to be ready
//       await new Promise((resolve, reject) => {
//         cameraPreview.onloadedmetadata = () => {
//           console.log('Camera stream ready');
//           resolve();
//         };
//         cameraPreview.onerror = reject;
        
//         // Timeout after 10 seconds
//         setTimeout(() => reject(new Error('Camera timeout')), 10000);
//       });
      
//       this._showPermissionIndicator('Camera access granted!', 'success');
      
//     } catch (error) {
//       // Reset button
//       requestBtn.innerHTML = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
//           <circle cx="12" cy="13" r="4"></circle>
//         </svg>
//         Open Camera
//       `;
//       requestBtn.disabled = false;
      
//       throw error;
//     }
//   }
  
//   _showCameraView() {
//     document.getElementById('permission-screen').classList.remove('active');
//     document.getElementById('camera-view').classList.add('active');
//     document.getElementById('photo-result').classList.remove('active');
//     this._isUsingCamera = true;
//   }
  
//   _closeCameraView() {
//     this._stopMediaStream();
//     document.getElementById('permission-screen').classList.add('active');
//     document.getElementById('camera-view').classList.remove('active');
//     document.getElementById('photo-result').classList.remove('active');
//     this._isUsingCamera = false;
//   }
  
//   async _switchCamera() {
//     const switchBtn = document.getElementById('switch-camera-btn');
    
//     // Show loading state
//     switchBtn.innerHTML = `
//       <div class="loading-spinner"></div>
//     `;
//     switchBtn.disabled = true;
    
//     try {
//       // Switch facing mode
//       this._currentFacingMode = this._currentFacingMode === 'environment' ? 'user' : 'environment';
      
//       // Stop current stream
//       this._stopMediaStream();
      
//       // Start new stream with different camera
//       this._mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: this._currentFacingMode,
//           width: { ideal: 640 },
//           height: { ideal: 480 }
//         },
//         audio: false
//       });
      
//       // Update preview
//       const cameraPreview = document.getElementById('camera-preview');
//       cameraPreview.srcObject = this._mediaStream;
      
//       const cameraType = this._currentFacingMode === 'environment' ? 'Back' : 'Front';
//       this._showPermissionIndicator(`Switched to ${cameraType} camera`, 'success');
      
//     } catch (error) {
//       console.error('Error switching camera:', error);
//       this._showError('Unable to switch camera');
//     } finally {
//       // Reset button
//       switchBtn.innerHTML = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M3 2v6h6"></path>
//           <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
//           <path d="M21 22v-6h-6"></path>
//           <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
//         </svg>
//       `;
//       switchBtn.disabled = false;
//     }
//   }
  
//   _capturePhoto() {
//     console.log('Capturing photo...');
    
//     const cameraPreview = document.getElementById('camera-preview');
//     const photoCanvas = document.getElementById('photo-canvas');
//     const capturedPhoto = document.getElementById('captured-photo');
    
//     if (!cameraPreview.videoWidth || !cameraPreview.videoHeight) {
//       this._showError('Camera not ready. Please try again.');
//       return;
//     }
    
//     // Set canvas dimensions
//     photoCanvas.width = cameraPreview.videoWidth;
//     photoCanvas.height = cameraPreview.videoHeight;
    
//     // Draw video frame to canvas
//     const context = photoCanvas.getContext('2d');
//     context.drawImage(cameraPreview, 0, 0);
    
//     // Convert to blob and create file
//     photoCanvas.toBlob((blob) => {
//       if (!blob) {
//         this._showError('Failed to capture photo');
//         return;
//       }
      
//       // Create file from blob
//       this._photoFile = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
//       // Show captured photo
//       const photoUrl = URL.createObjectURL(blob);
//       capturedPhoto.src = photoUrl;
      
//       // Show photo result screen
//       this._showCapturedPhoto();
      
//       this._showPermissionIndicator('Photo captured!', 'success');
      
//     }, 'image/jpeg', 0.8);
//   }
  
//   _showCapturedPhoto() {
//     document.getElementById('permission-screen').classList.remove('active');
//     document.getElementById('camera-view').classList.remove('active');
//     document.getElementById('photo-result').classList.add('active');
    
//     // Stop camera stream
//     this._stopMediaStream();
//   }
  
//   _retakePhoto() {
//     // Go back to camera view
//     this._showCameraView();
    
//     // Restart camera
//     this._requestCameraPermission().catch(error => {
//       console.error('Error restarting camera:', error);
//       this._closeCameraView();
//       this._showError(this._getCameraErrorMessage(error));
//     });
//   }
  
//   _usePhoto() {
//     // Hide camera interface and show success
//     this._closeCameraView();
//     this._showPermissionIndicator('Photo selected successfully!', 'success');
//   }
  
//   _handleFileUpload(file) {
//     // Validate file
//     if (!file.type.startsWith('image/')) {
//       this._showError('Please select a valid image file.');
//       return;
//     }
    
//     if (file.size > 1024 * 1024) {
//       this._showError('Image file size must be less than 1MB.');
//       return;
//     }
    
//     this._photoFile = file;
    
//     // Show file preview in photo result screen
//     const capturedPhoto = document.getElementById('captured-photo');
//     const photoUrl = URL.createObjectURL(file);
//     capturedPhoto.src = photoUrl;
    
//     this._showCapturedPhoto();
//     this._showPermissionIndicator('Photo uploaded successfully!', 'success');
//   }
  
//   _getCameraErrorMessage(error) {
//     if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
//       return 'Camera permission denied. Please allow camera access and try again.';
//     } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
//       return 'No camera found on this device.';
//     } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
//       return 'Camera is already in use by another application.';
//     } else if (error.name === 'OverconstrainedError') {
//       return 'Camera does not support the requested settings.';
//     } else if (error.name === 'SecurityError') {
//       return 'Camera access blocked. Please use HTTPS.';
//     } else {
//       return error.message || 'Unable to access camera. Please try uploading from gallery instead.';
//     }
//   }
  
//   _setupLocationMap() {
//     console.log('Setting up location map...');
    
//     // Load Leaflet CSS and JS
//     if (!document.querySelector('link[href*="leaflet"]')) {
//       const leafletCSS = document.createElement('link');
//       leafletCSS.rel = 'stylesheet';
//       leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//       document.head.appendChild(leafletCSS);
//     }
    
//     if (!window.L) {
//       const leafletScript = document.createElement('script');
//       leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//       document.head.appendChild(leafletScript);
      
//       leafletScript.onload = () => {
//         console.log('Leaflet loaded successfully');
//         this._initMap();
//       };
      
//       leafletScript.onerror = () => {
//         console.error('Failed to load Leaflet');
//         document.getElementById('location-map').innerHTML = `
//           <div class="map-error">
//             <p>Unable to load map. Please check your internet connection.</p>
//           </div>
//         `;
//       };
//     } else {
//       this._initMap();
//     }
//   }
  
//   _initMap() {
//     try {
//       console.log('Initializing map...');
      
//       const mapConfig = window.APP_CONFIG?.MAP || {
//         DEFAULT_LAT: -2.5489, 
//         DEFAULT_LON: 118.0149,
//         DEFAULT_ZOOM: 5,
//         TILE_PROVIDER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//         ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       };
      
//       this._map = L.map('location-map').setView(
//         [mapConfig.DEFAULT_LAT, mapConfig.DEFAULT_LON], 
//         mapConfig.DEFAULT_ZOOM
//       );
      
//       L.tileLayer(mapConfig.TILE_PROVIDER, {
//         attribution: mapConfig.ATTRIBUTION,
//         maxZoom: 18,
//       }).addTo(this._map);
      
//       setTimeout(() => {
//         if (this._map) {
//           this._map.invalidateSize();
//           console.log("Map size refreshed");
//         }
//       }, 500);
      
//       this._setupLocationControls();
      
//       this._map.on('click', (event) => {
//         this._setLocation(event.latlng.lat, event.latlng.lng);
//       });
      
//     } catch (error) {
//       console.error('Error initializing map:', error);
//       document.getElementById('location-map').innerHTML = `
//         <div class="map-error">
//           <p>Error loading map. Location selection is optional.</p>
//         </div>
//       `;
//     }
//   }
  
//   _setupLocationControls() {
//     const useMyLocationBtn = document.getElementById('use-my-location-btn');
//     const clearLocationBtn = document.getElementById('clear-location-btn');
    
//     useMyLocationBtn.addEventListener('click', () => {
//       if ('geolocation' in navigator) {
//         useMyLocationBtn.innerHTML = `
//           <div class="loading-spinner"></div>
//           Getting location...
//         `;
//         useMyLocationBtn.disabled = true;
        
//         this._showPermissionIndicator('Getting your location...');
        
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             console.log(`Location found: ${latitude}, ${longitude}`);
//             this._setLocation(latitude, longitude);
//             this._map.setView([latitude, longitude], 15);
            
//             useMyLocationBtn.innerHTML = `
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                 <circle cx="12" cy="10" r="3"></circle>
//               </svg>
//               Use My Location
//             `;
//             useMyLocationBtn.disabled = false;
            
//             this._showPermissionIndicator('Location found!', 'success');
//           },
//           (error) => {
//             console.error('Geolocation error:', error);
            
//             let errorMessage = 'Unable to get your location. ';
//             if (error.code === 1) {
//               errorMessage += 'Location permission denied. Please enable location access in your browser settings.';
//             } else if (error.code === 2) {
//               errorMessage += 'Location information unavailable. Try again later.';
//             } else if (error.code === 3) {
//               errorMessage += 'Location request timed out. Check your internet connection.';
//             }
//             errorMessage += ' You can select a location manually on the map.';
            
//             this._showError(errorMessage);
//             this._showPermissionIndicator('Location access failed', 'error');
            
//             useMyLocationBtn.innerHTML = `
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                 <circle cx="12" cy="10" r="3"></circle>
//               </svg>
//               Use My Location
//             `;
//             useMyLocationBtn.disabled = false;
//           },
//           { 
//             enableHighAccuracy: true, 
//             timeout: 10000, 
//             maximumAge: 0
//           }
//         );
//       } else {
//         this._showError('Geolocation is not supported by your browser.');
//       }
//     });
    
//     clearLocationBtn.addEventListener('click', () => {
//       this._clearLocation();
//     });
//   }
  
//   _setLocation(lat, lng) {
//     if (this._marker) {
//       this._map.removeLayer(this._marker);
//     }
    
//     this._marker = L.marker([lat, lng]).addTo(this._map);
//     this._location = { lat, lon: lng };
    
//     const locationText = document.getElementById('location-text');
//     const locationDisplay = document.getElementById('location-display');
//     const locationCoords = document.getElementById('location-coords');
    
//     locationText.style.display = 'none';
//     locationDisplay.style.display = 'flex';
//     locationCoords.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
//   }
  
//   _clearLocation() {
//     if (this._marker) {
//       this._map.removeLayer(this._marker);
//       this._marker = null;
//     }
    
//     this._location = null;
    
//     const locationText = document.getElementById('location-text');
//     const locationDisplay = document.getElementById('location-display');
    
//     locationText.style.display = 'block';
//     locationDisplay.style.display = 'none';
//   }
  
//   _setupForm() {
//     const addStoryForm = document.getElementById('add-story-form');
    
//     addStoryForm.addEventListener('submit', async (event) => {
//       event.preventDefault();
      
//       const description = document.getElementById('description').value.trim();
      
//       // Validate inputs
//       if (!description) {
//         this._showError('Please enter a description for your story');
//         document.getElementById('description').focus();
//         return;
//       }
      
//       if (description.length < 10) {
//         this._showError('Story description should be at least 10 characters long');
//         document.getElementById('description').focus();
//         return;
//       }
      
//       if (!this._photoFile) {
//         this._showError('Please capture or upload a photo');
//         return;
//       }
      
//       await this._submitStory(description);
//     });
//   }
  
//   async _submitStory(description) {
//     const submitButton = document.getElementById('submit-button');
//     const errorContainer = document.getElementById('error-container');
//     const form = document.getElementById('add-story-form');
    
//     try {
//       errorContainer.innerHTML = '';
      
//       // Update button state
//       submitButton.innerHTML = `
//         <div class="loading-spinner"></div>
//         Posting Story...
//       `;
//       submitButton.disabled = true;
//       submitButton.classList.add('loading');
      
//       // Disable form
//       const formElements = form.querySelectorAll('input, textarea, button');
//       formElements.forEach(element => {
//         if (element !== submitButton) {
//           element.disabled = true;
//         }
//       });
      
//       const auth = AuthStore.getAuth();
      
//       // Prepare data for API
//       const storyData = {
//         token: auth.token,
//         description,
//         photo: this._photoFile,
//       };
      
//       // Add location if available
//       if (this._location) {
//         storyData.lat = this._location.lat;
//         storyData.lon = this._location.lon;
//       }
      
//       // Send data to API
//       const result = await StoryApi.addStory(storyData);
      
//       if (result.error) {
//         throw new Error(result.message);
//       }
      
//       // Show success message
//       errorContainer.innerHTML = `
//         <div class="success-message">
//           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//             <polyline points="22,4 12,14.01 9,11.01"></polyline>
//           </svg>
//           <p>Story posted successfully! Redirecting to home...</p>
//         </div>
//       `;
      
//       // Update button to success state
//       submitButton.innerHTML = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//           <polyline points="22,4 12,14.01 9,11.01"></polyline>
//         </svg>
//         Story Posted!
//       `;
//       submitButton.classList.remove('loading');
//       submitButton.classList.add('success');
      
//       this._showPermissionIndicator('Story posted successfully!', 'success');
      
//       // Redirect to home page after 2 seconds
//       setTimeout(() => {
//         window.location.hash = '#/';
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error posting story:', error);
//       this._showError(error.message || 'Failed to post story. Please try again.');
      
//       // Reset button
//       submitButton.innerHTML = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
//           <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
//         </svg>
//         Post Story
//       `;
//       submitButton.disabled = false;
//       submitButton.classList.remove('loading');
      
//       // Re-enable form
//       const form = document.getElementById('add-story-form');
//       const formElements = form.querySelectorAll('input, textarea, button');
//       formElements.forEach(element => {
//         element.disabled = false;
//       });
      
//       this._showPermissionIndicator('Failed to post story', 'error');
//     }
//   }
  
//   _showPermissionIndicator(message, type = 'info') {
//     // Remove existing indicator
//     const existing = document.querySelector('.permission-indicator');
//     if (existing) {
//       existing.remove();
//     }
    
//     const indicator = document.createElement('div');
//     indicator.className = `permission-indicator ${type}`;
//     indicator.textContent = message;
    
//     document.body.appendChild(indicator);
    
//     // Auto remove after 4 seconds
//     setTimeout(() => {
//       if (indicator.parentNode) {
//         indicator.style.animation = 'slideUp 0.3s ease-in forwards';
//         setTimeout(() => {
//           if (indicator.parentNode) {
//             indicator.remove();
//           }
//         }, 300);
//       }
//     }, 4000);
//   }
  
//   _showError(message) {
//     const errorContainer = document.getElementById('error-container');
    
//     if (!errorContainer) {
//       console.error('Error container not found');
//       return;
//     }
    
//     console.error('Error occurred:', message);
    
//     const errorDiv = document.createElement('div');
//     errorDiv.className = 'error-message';
//     errorDiv.innerHTML = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//         <circle cx="12" cy="12" r="10"></circle>
//         <line x1="15" y1="9" x2="9" y2="15"></line>
//         <line x1="9" y1="9" x2="15" y2="15"></line>
//       </svg>
//       <div>
//         <p>${message}</p>
//       </div>
//     `;
    
//     errorContainer.innerHTML = '';
//     errorContainer.appendChild(errorDiv);
    
//     errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   }
  
//   _stopMediaStream() {
//     if (this._mediaStream) {
//       this._mediaStream.getTracks().forEach(track => {
//         try {
//           track.stop();
//         } catch (e) {
//           console.error('Error stopping track:', e);
//         }
//       });
//       this._mediaStream = null;
//     }
//   }
  
//   // Clean up resources when navigating away
//   async beforeDestroy() {
//     this._stopMediaStream();
    
//     // Clean up map if it exists
//     if (this._map) {
//       this._map.remove();
//       this._map = null;
//     }
    
//     // Remove any permission indicators
//     const indicator = document.querySelector('.permission-indicator');
//     if (indicator) {
//       indicator.remove();
//     }
//   }
// }