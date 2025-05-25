import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import AuthStore from '../data/auth-store';

class App {
  #content = null;
  #currentPage = null;

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    
    // Clean up previous page if needed
    if (this.#currentPage && typeof this.#currentPage.beforeDestroy === 'function') {
      await this.#currentPage.beforeDestroy();
    }
    
    this.#currentPage = page;
    
    // Use View Transition API if supported
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        // Update the DOM
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      // Fallback for browsers that don't support View Transition API
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
    
    // Update active nav link
    this._updateActiveNavLink();
  }
  
  _updateActiveNavLink() {
    const currentHash = window.location.hash || '#/';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      }
    });
  }
}

export default App;