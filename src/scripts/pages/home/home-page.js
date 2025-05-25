import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';
import { showFormattedDate } from '../../utils';

export default class HomePage {
  async render() {
    return `
      <section class="home-page">
        <div class="container">
          <h2 class="page-section-title">Recent Stories</h2>
          
          <div id="story-list" class="story-list">
            <div class="loading-indicator">
              <p>Loading stories...</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initialUI();
    await this._fetchStories();
    this._showWelcomeModal();
  }
  
  _initialUI() {
    // Add skip to content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.setAttribute('href', '#story-list');
    skipLink.classList.add('skip-link');
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Update active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#/') {
        link.classList.add('active');
      }
    });
  }

  async _fetchStories() {
    try {
      const storyListContainer = document.getElementById('story-list');
      const auth = AuthStore.getAuth();
      
      // If not logged in, we'll still show the "no stories" UI
      // The welcome modal will handle the login prompt
      let stories = [];
      
      if (auth) {
        const result = await StoryApi.getStories({ 
          token: auth.token,
          location: 1, // Include location data
        });
        
        if (!result.error) {
          stories = result.listStory;
        } else {
          storyListContainer.innerHTML = `
            <div class="error-container">
              <p>Failed to load stories: ${result.message}</p>
            </div>
          `;
          return;
        }
      }
      
      this._renderStories(stories);
    } catch (error) {
      const storyListContainer = document.getElementById('story-list');
      storyListContainer.innerHTML = `
        <div class="error-container">
          <p>Error: ${error.message}</p>
        </div>
      `;
    }
  }
  
  _renderStories(stories) {
    const storyListContainer = document.getElementById('story-list');
    
    if (stories.length === 0) {
      storyListContainer.innerHTML = `
        <div class="story-container">
          <div class="empty-stories">
            <div class="book-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p class="empty-message">No stories available yet. Be the first to share your story!</p>
            <a href="#/add" class="add-story-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New Story
            </a>
          </div>
        </div>
      `;
      return;
    }
    
    const storiesHTML = stories.map(story => `
      <article class="story-item">
        <a href="#/detail/${story.id}" class="story-link">
          <div class="story-image-container">
            <img 
              src="${story.photoUrl}" 
              alt="Story by ${story.name}" 
              class="story-image" 
              loading="lazy"
            />
          </div>
          
          <div class="story-content">
            <h2 class="story-name">${story.name}</h2>
            <p class="story-description">${story.description.length > 100 
              ? story.description.substring(0, 100) + '...' 
              : story.description}</p>
            <p class="story-date">${showFormattedDate(story.createdAt)}</p>
            
            ${story.lat && story.lon ? `
              <div class="story-location">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Has location
              </div>
            ` : ''}
          </div>
        </a>
      </article>
    `).join('');
    
    storyListContainer.innerHTML = `
      <div class="stories-grid">
        ${storiesHTML}
      </div>
    `;
  }
  
  _showWelcomeModal() {
    // Only show welcome modal if user is not logged in
    if (!AuthStore.isLoggedIn()) {
      const modal = document.getElementById('welcome-modal');
      const loginBtn = document.getElementById('login-modal-btn');
      const laterBtn = document.getElementById('later-modal-btn');
      
      // Show modal
      modal.classList.add('show');
      
      // Login button click handler
      loginBtn.addEventListener('click', () => {
        window.location.hash = '#/login';
        modal.classList.remove('show');
      });
      
      // Maybe later button click handler
      laterBtn.addEventListener('click', () => {
        modal.classList.remove('show');
      });
    }
  }
}