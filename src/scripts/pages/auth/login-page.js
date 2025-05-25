import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="container">
          <div class="auth-container">
            <h1>Login</h1>
            
            <form id="login-form" class="auth-form">
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="Enter your email" 
                  autocomplete="email"
                />
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required 
                  placeholder="Enter your password" 
                  autocomplete="current-password" 
                  minlength="8"
                />
              </div>
              
              <div id="error-container" class="error-container"></div>
              
              <div class="auth-actions">
                <button type="submit" class="primary-button">
                  Login
                </button>
              </div>
            </form>
            
            <div class="auth-footer">
              <p>Don't have an account? <a href="#/register">Register</a></p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this._initialUI();
    this._setupForm();
  }
  
  _initialUI() {
    // Update active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#/login') {
        link.classList.add('active');
      }
    });
    
    // If already logged in, redirect to home
    if (AuthStore.isLoggedIn()) {
      window.location.hash = '#/';
    }
  }
  
  _setupForm() {
    const loginForm = document.getElementById('login-form');
    const errorContainer = document.getElementById('error-container');
    
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        errorContainer.innerHTML = '';
        
        const loginButton = loginForm.querySelector('button[type="submit"]');
        loginButton.innerHTML = 'Logging in...';
        loginButton.disabled = true;
        
        const result = await StoryApi.login({ email, password });
        
        if (result.error) {
          errorContainer.innerHTML = `<p>${result.message}</p>`;
          loginButton.innerHTML = 'Login';
          loginButton.disabled = false;
          return;
        }
        
        // Save auth data
        AuthStore.saveAuth({
          userId: result.loginResult.userId,
          name: result.loginResult.name,
          token: result.loginResult.token,
        });
        
        // Redirect to home
        window.location.hash = '#/';
        // Reload page to update navigation
        window.location.reload();
      } catch (error) {
        errorContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        
        const loginButton = loginForm.querySelector('button[type="submit"]');
        loginButton.innerHTML = 'Login';
        loginButton.disabled = false;
      }
    });
  }
}