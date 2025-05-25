import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';

export default class AddStoryPage {
  constructor() {
    this._mediaStream = null;
    this._photoFile = null;
    this._location = null;
    this._map = null;
    this._marker = null;
  }
  
  async render() {
    return `
      <section class="add-story-page">
        <div class="container">
          <div class="add-story-container">
            <h1>Add New Story</h1>
            
            <form id="add-story-form" class="add-story-form">
              <div class="form-group">
                <label for="description">Story Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder="Share your story..."
                  rows="4"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="photo-preview">Photo</label>
                <div class="photo-input-container">
                  <div id="camera-container" class="camera-container">
                    <video id="camera-preview" class="camera-preview" autoplay playsinline></video>
                    <canvas id="photo-canvas" class="photo-canvas" style="display: none;"></canvas>
                    <div id="photo-preview-container" class="photo-preview-container" style="display: none;">
                      <img id="photo-preview" class="photo-preview" alt="Preview of captured photo" />
                    </div>
                  </div>
                  
                  <div class="camera-controls">
                    <button type="button" id="start-camera-btn" class="camera-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                      </svg>
                      Start Camera
                    </button>
                    <button type="button" id="capture-btn" class="camera-btn" style="display: none;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      Capture
                    </button>
                    <button type="button" id="recapture-btn" class="camera-btn" style="display: none;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 2v6h6"></path>
                        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                        <path d="M21 22v-6h-6"></path>
                        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
                      </svg>
                      Retake
                    </button>
                  </div>
                  
                  <div class="file-upload-fallback">
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
                <label for="location-map">Location (Click on the map to set your location)</label>
                <div id="location-map" class="location-map"></div>
                
                <div class="location-info">
                  <p id="location-text">No location selected</p>
                  <button type="button" id="clear-location-btn" class="secondary-button" style="display: none;">
                    Clear Location
                  </button>
                </div>
              </div>
              
              <div id="error-container" class="error-container"></div>
              
              <div class="auth-actions">
                <button type="submit" id="submit-button" class="primary-button">
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
    const startCameraBtn = document.getElementById('start-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const recaptureBtn = document.getElementById('recapture-btn');
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const photoPreviewContainer = document.getElementById('photo-preview-container');
    const photoPreview = document.getElementById('photo-preview');
    
    // Start camera when button is clicked
    startCameraBtn.addEventListener('click', async () => {
      try {
        // Request camera access
        this._mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        
        // Show camera preview
        cameraPreview.srcObject = this._mediaStream;
        cameraPreview.style.display = 'block';
        
        // Show capture button, hide start button
        captureBtn.style.display = 'inline-block';
        startCameraBtn.style.display = 'none';
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please make sure you have given permission to use the camera or use the file upload option.');
      }
    });
    
    // Capture photo when button is clicked
    captureBtn.addEventListener('click', () => {
      // Set canvas dimensions to match video
      photoCanvas.width = cameraPreview.videoWidth;
      photoCanvas.height = cameraPreview.videoHeight;
      
      // Draw video frame to canvas
      const context = photoCanvas.getContext('2d');
      context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
      
      // Convert canvas to blob
      photoCanvas.toBlob((blob) => {
        // Create a File object from the blob
        this._photoFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // Display the captured photo
        const photoUrl = URL.createObjectURL(blob);
        photoPreview.src = photoUrl;
        photoPreviewContainer.style.display = 'block';
        
        // Hide camera preview, show recapture button
        cameraPreview.style.display = 'none';
        captureBtn.style.display = 'none';
        recaptureBtn.style.display = 'inline-block';
        
        // Stop the camera stream
        this._stopMediaStream();
      }, 'image/jpeg', 0.8);
    });
    
    // Retake photo when button is clicked
    recaptureBtn.addEventListener('click', async () => {
      // Clear previous photo
      this._photoFile = null;
      photoPreview.src = '';
      photoPreviewContainer.style.display = 'none';
      
      // Restart camera
      try {
        this._mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        
        // Show camera preview
        cameraPreview.srcObject = this._mediaStream;
        cameraPreview.style.display = 'block';
        
        // Show capture button, hide recapture button
        captureBtn.style.display = 'inline-block';
        recaptureBtn.style.display = 'none';
      } catch (error) {
        console.error('Error restarting camera:', error);
        alert('Unable to restart camera. Please refresh the page and try again.');
      }
    });
    
    // Handle file upload
    const photoUpload = document.getElementById('photo-upload');
    photoUpload.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        // Get the selected file
        this._photoFile = event.target.files[0];
        
        // Display the selected photo
        const photoUrl = URL.createObjectURL(this._photoFile);
        photoPreview.src = photoUrl;
        photoPreviewContainer.style.display = 'block';
        
        // Hide camera preview, show recapture button
        cameraPreview.style.display = 'none';
        captureBtn.style.display = 'none';
        startCameraBtn.style.display = 'none';
        recaptureBtn.style.display = 'inline-block';
        
        // Stop the camera stream if it's running
        this._stopMediaStream();
      }
    });
  }
  
  _setupLocationMap() {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }
    
    // Load Leaflet script if not already loaded
    if (!window.L) {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(leafletScript);
      
      leafletScript.onload = () => {
        this._initMap();
      };
    } else {
      this._initMap();
    }
  }
  
  _initMap() {
    const locationMap = document.getElementById('location-map');
    const locationText = document.getElementById('location-text');
    const clearLocationBtn = document.getElementById('clear-location-btn');
    
    // Create map centered at a default location (Indonesia)
    this._map = L.map('location-map').setView([-2.5489, 118.0149], 5);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);
    
    // Get the map container size after it's rendered
    setTimeout(() => {
      this._map.invalidateSize();
    }, 100);
    
    // Add click event to the map
    this._map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      
      // Remove existing marker if any
      if (this._marker) {
        this._map.removeLayer(this._marker);
      }
      
      // Add a new marker at the clicked position
      this._marker = L.marker([lat, lng]).addTo(this._map);
      
      // Update location data
      this._location = { lat, lon: lng };
      
      // Update location text
      locationText.textContent = `Selected location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      
      // Show clear button
      clearLocationBtn.style.display = 'inline-block';
    });
    
    // Add clear location button functionality
    clearLocationBtn.addEventListener('click', () => {
      // Remove marker if any
      if (this._marker) {
        this._map.removeLayer(this._marker);
        this._marker = null;
      }
      
      // Clear location data
      this._location = null;
      
      // Update location text
      locationText.textContent = 'No location selected';
      
      // Hide clear button
      clearLocationBtn.style.display = 'none';
    });
  }
  
  _setupForm() {
    const addStoryForm = document.getElementById('add-story-form');
    const errorContainer = document.getElementById('error-container');
    
    addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.getElementById('description').value;
      
      // Validate inputs
      if (!description) {
        errorContainer.innerHTML = '<p>Please enter a description for your story</p>';
        return;
      }
      
      if (!this._photoFile) {
        errorContainer.innerHTML = '<p>Please capture or upload a photo</p>';
        return;
      }
      
      try {
        errorContainer.innerHTML = '';
        
        const submitButton = addStoryForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Posting...';
        submitButton.disabled = true;
        
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
          errorContainer.innerHTML = `<p>${result.message}</p>`;
          submitButton.innerHTML = 'Post Story';
          submitButton.disabled = false;
          return;
        }
        
        // Show success message
        errorContainer.innerHTML = `
          <div class="success-message">
            <p>Story posted successfully!</p>
          </div>
        `;
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.hash = '#/';
        }, 2000);
      } catch (error) {
        errorContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        
        const submitButton = addStoryForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = 'Post Story';
        submitButton.disabled = false;
      }
    });
  }
  
  _stopMediaStream() {
    // Stop all tracks in the media stream
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach(track => track.stop());
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
  }
}