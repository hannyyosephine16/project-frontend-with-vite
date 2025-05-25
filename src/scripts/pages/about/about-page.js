export default class AboutPage {
  async render() {
    return `
      <section class="about-page">
        <div class="container">
          <h1 class="page-title">About Dicoding Stories</h1>
          
          <div class="about-content">
            <div class="about-section">
              <h2>What is Dicoding Stories?</h2>
              <p>Dicoding Stories is a platform where the Dicoding community can share their stories, experiences, and moments through photos and text. Think of it as a special Instagram just for the Dicoding community!</p>
            </div>
            
            <div class="about-section">
              <h2>Features</h2>
              <ul class="feature-list">
                <li>
                  <i class="fa fa-camera"></i>
                  <div>
                    <h3>Share Stories</h3>
                    <p>Capture moments with your camera or upload photos and share your stories with the community.</p>
                  </div>
                </li>
                <li>
                  <i class="fa fa-map-marker"></i>
                  <div>
                    <h3>Location Sharing</h3>
                    <p>Add your location to stories and see where other community members are posting from.</p>
                  </div>
                </li>
                <li>
                  <i class="fa fa-bell"></i>
                  <div>
                    <h3>Notifications</h3>
                    <p>Get notified when your story is successfully posted.</p>
                  </div>
                </li>
                <li>
                  <i class="fa fa-mobile"></i>
                  <div>
                    <h3>Mobile Friendly</h3>
                    <p>Access Dicoding Stories from any device - mobile, tablet, or desktop.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="about-section">
              <h2>Technologies Used</h2>
              <ul class="tech-list">
                <li>
                  <i class="fa fa-code"></i>
                  <span>Single-Page Application Architecture</span>
                </li>
                <li>
                  <i class="fa fa-html5"></i>
                  <span>HTML5, CSS3, JavaScript</span>
                </li>
                <li>
                  <i class="fa fa-map"></i>
                  <span>Leaflet.js for Maps</span>
                </li>
                <li>
                  <i class="fa fa-universal-access"></i>
                  <span>Accessibility Features</span>
                </li>
                <li>
                  <i class="fa fa-exchange"></i>
                  <span>View Transition API</span>
                </li>
              </ul>
            </div>
            
            <div class="about-section">
              <h2>Developer</h2>
              <p>This application was developed as a final project for Dicoding's class. The goal was to build a Single-Page Application (SPA) that utilizes the Dicoding Story API to create a story sharing platform similar to Instagram, but specifically for the Dicoding community.</p>
              <p>Feel free to explore the app, create an account, and share your own stories!</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Add skip to content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.setAttribute('href', '.about-content');
    skipLink.classList.add('skip-link');
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}