import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';
import { parseActivePathname } from '../../routes/url-parser';
import { showFormattedDate } from '../../utils';

export default class DetailPage {
  async render() {
    return `
      <section class="detail-page">
        <div class="container">
          <a href="#/" class="back-button" aria-label="Back to stories">
            <i class="fa fa-arrow-left"></i> Back
          </a>
          
          <div id="story-detail" class="story-detail">
            <div class="loading-indicator">
              <p>Loading story...</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initialUI();
    await this._fetchStoryDetail();
  }
  
  _initialUI() {
    // Add skip to content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.setAttribute('href', '#story-detail');
    skipLink.classList.add('skip-link');
    skipLink.textContent = 'Skip to story content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  async _fetchStoryDetail() {
    try {
      const storyDetailContainer = document.getElementById('story-detail');
      const auth = AuthStore.getAuth();
      
      // If not logged in, show guest view with login prompt
      if (!auth) {
        storyDetailContainer.innerHTML = `
          <div class="guest-message">
            <p>Login to see story details</p>
            <a href="#/login" class="login-button">Login</a>
            <a href="#/register" class="register-button">Register</a>
          </div>
        `;
        return;
      }
      
      const { id } = parseActivePathname();
      
      if (!id) {
        storyDetailContainer.innerHTML = `
          <div class="error-container">
            <p>Story ID is required</p>
          </div>
        `;
        return;
      }
      
      const result = await StoryApi.getStoryDetail({ 
        token: auth.token,
        id,
      });
      
      if (!result.error) {
        this._renderStoryDetail(result.story);
      } else {
        storyDetailContainer.innerHTML = `
          <div class="error-container">
            <p>Failed to load story: ${result.message}</p>
          </div>
        `;
      }
    } catch (error) {
      const storyDetailContainer = document.getElementById('story-detail');
      storyDetailContainer.innerHTML = `
        <div class="error-container">
          <p>Error: ${error.message}</p>
        </div>
      `;
    }
  }
  
  _renderStoryDetail(story) {
    const storyDetailContainer = document.getElementById('story-detail');
    
    storyDetailContainer.innerHTML = `
      <article class="story-detail-content" style="view-transition-name: story-${story.id}">
        <div class="story-image-container">
          <img 
            src="${story.photoUrl}" 
            alt="Story by ${story.name}" 
            class="story-detail-image"
          />
        </div>
        
        <div class="story-meta">
          <h1 class="story-author">${story.name}</h1>
          <p class="story-date">${showFormattedDate(story.createdAt)}</p>
        </div>
        
        <p class="story-description">${story.description}</p>
        
        ${story.lat && story.lon ? `
          <div class="story-map-container">
            <h2>Location</h2>
            <div id="detail-map" class="detail-map"></div>
          </div>
        ` : ''}
      </article>
    `;
    
    // Initialize map if location exists
    if (story.lat && story.lon) {
      this._initMap(story);
    }
  }
  
  _initMap(story) {
    // Load Leaflet script if not already loaded
    if (!window.L) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
      
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(leafletScript);
      
      leafletScript.onload = () => {
        this._renderMap(story);
      };
    } else {
      this._renderMap(story);
    }
  }
  
  _renderMap(story) {
    // Create map
    const map = L.map('detail-map').setView([story.lat, story.lon], 13);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    const marker = L.marker([story.lat, story.lon]).addTo(map);
    
    // Add popup with story info
    marker.bindPopup(`
      <div class="map-popup">
        <h3>${story.name}</h3>
        <p>${story.description.length > 50 
          ? story.description.substring(0, 50) + '...' 
          : story.description}</p>
      </div>
    `).openPopup();
  }
}