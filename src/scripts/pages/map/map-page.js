import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';
import { showFormattedDate } from '../../utils';

export default class MapPage {
  constructor() {
    this._map = null;
    this._markers = [];
    this._stories = [];
  }
  
  async render() {
    return `
      <section class="map-page">
        <div class="container">
          <div class="map-header">
            <h1 class="page-title">Story Map</h1>
            <a href="#/" class="back-button" aria-label="Back to stories">
              <i class="fa fa-arrow-left"></i> Back to Stories
            </a>
          </div>
          
          <div class="map-controls">
            <div id="layer-control-container" class="layer-control-container">
              <!-- Layer controls will be inserted here -->
            </div>
            
            <div class="map-info">
              <p>Click on markers to view story details</p>
            </div>
          </div>
          
          <div id="stories-map" class="stories-map">
            <div class="loading-indicator">
              <p>Loading map...</p>
            </div>
          </div>
          
          <div id="story-list-container" class="story-list-container">
            <h2>Stories with Location</h2>
            <div id="map-story-list" class="map-story-list">
              <p>Loading stories...</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initialUI();
    this._setupMap();
    await this._fetchStories();
  }
  
  _initialUI() {
    // Add skip to content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.setAttribute('href', '#stories-map');
    skipLink.classList.add('skip-link');
    skipLink.textContent = 'Skip to map';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  _setupMap() {
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
        this._initMap();
      };
    } else {
      this._initMap();
    }
  }
  
  _initMap() {
    // Create map centered at a default location (Indonesia)
    this._map = L.map('stories-map').setView([-2.5489, 118.0149], 5);
    
    // Define base layers for layer control
    const baseLayers = {
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      'Topo Map': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      })
    };
    
    // Add default base layer to map
    baseLayers['OpenStreetMap'].addTo(this._map);
    
    // Add layer control to the map
    const layerControl = L.control.layers(baseLayers, null, { collapsed: false });
    layerControl.addTo(this._map);
  }
  
  async _fetchStories() {
    try {
      const mapStoryListContainer = document.getElementById('map-story-list');
      const auth = AuthStore.getAuth();
      
      // If not logged in, show guest view with login prompt
      if (!auth) {
        mapStoryListContainer.innerHTML = `
          <div class="guest-message">
            <p>Login to see stories on the map</p>
            <a href="#/login" class="login-button">Login</a>
            <a href="#/register" class="register-button">Register</a>
          </div>
        `;
        return;
      }
      
      const result = await StoryApi.getStories({ 
        token: auth.token,
        location: 1, // Include location data
      });
      
      if (!result.error) {
        // Filter stories with location
        this._stories = result.listStory.filter(story => story.lat && story.lon);
        
        if (this._stories.length > 0) {
          this._renderStoriesOnMap();
          this._renderStoriesList();
        } else {
          document.getElementById('stories-map').innerHTML = `
            <div class="empty-state">
              <p>No stories with location found</p>
            </div>
          `;
          
          mapStoryListContainer.innerHTML = `
            <div class="empty-state">
              <p>No stories with location available</p>
              <a href="#/add" class="add-story-button">Add Story with Location</a>
            </div>
          `;
        }
      } else {
        document.getElementById('stories-map').innerHTML = `
          <div class="error-container">
            <p>Failed to load stories: ${result.message}</p>
          </div>
        `;
        
        mapStoryListContainer.innerHTML = `
          <div class="error-container">
            <p>Failed to load stories: ${result.message}</p>
          </div>
        `;
      }
    } catch (error) {
      document.getElementById('stories-map').innerHTML = `
        <div class="error-container">
          <p>Error: ${error.message}</p>
        </div>
      `;
      
      document.getElementById('map-story-list').innerHTML = `
        <div class="error-container">
          <p>Error: ${error.message}</p>
        </div>
      `;
    }
  }
  
  _renderStoriesOnMap() {
    // Create a marker group for stories
    const markerGroup = L.layerGroup().addTo(this._map);
    
    // Add markers for each story
    this._stories.forEach(story => {
      const marker = L.marker([story.lat, story.lon])
        .bindPopup(`
          <div class="map-popup">
            <h3>${story.name}</h3>
            <img 
              src="${story.photoUrl}" 
              alt="Story by ${story.name}" 
              class="popup-image" 
            />
            <p class="popup-description">${story.description.length > 100 
              ? story.description.substring(0, 100) + '...' 
              : story.description}</p>
            <p class="popup-date">${showFormattedDate(story.createdAt)}</p>
            <a href="#/detail/${story.id}" class="popup-link">View Details</a>
          </div>
        `);
      
      markerGroup.addLayer(marker);
      this._markers.push(marker);
    });
    
    // Fit map bounds to show all markers
    if (this._markers.length > 0) {
      const group = new L.featureGroup(this._markers);
      this._map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }
  
  _renderStoriesList() {
    const mapStoryListContainer = document.getElementById('map-story-list');
    
    const storiesHTML = this._stories.map(story => `
      <article class="map-story-item">
        <a href="#/detail/${story.id}" class="map-story-link">
          <div class="map-story-image-container">
            <img 
              src="${story.photoUrl}" 
              alt="Story by ${story.name}" 
              class="map-story-image" 
              loading="lazy"
            />
          </div>
          
          <div class="map-story-content">
            <h3 class="map-story-name">${story.name}</h3>
            <p class="map-story-description">${story.description.length > 50 
              ? story.description.substring(0, 50) + '...' 
              : story.description}</p>
            <p class="map-story-date">${showFormattedDate(story.createdAt)}</p>
            <p class="map-story-location">
              <i class="fa fa-map-marker"></i> ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
            </p>
          </div>
        </a>
      </article>
    `).join('');
    
    mapStoryListContainer.innerHTML = storiesHTML;
  }
}