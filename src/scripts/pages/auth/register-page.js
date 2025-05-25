import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="container">
          <div class="auth-container">
            <h1>Register</h1>
            
            <form id="register-form" class="auth-form">
              <div class="form-group">
                <label for="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Enter your name" 
                  autocomplete="name"
                />
              </div>
              
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
                  placeholder="Enter your password (min. 8 characters)" 
                  autocomplete="new-password" 
                  minlength="8"
                />
              </div>
              
              <div id="error-container" class="error-container"></div>
              
              <div class="auth-actions">
                <button type="submit" class="primary-button">
                  Register
                </button>
              </div>
            </form>
            
            <div class="auth-footer">
              <p>Already have an account? <a href="#/login">Login</a></p>
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
      if (link.getAttribute('href') === '#/register') {
        link.classList.add('active');
      }
    });
    
    // If already logged in, redirect to home
    if (AuthStore.isLoggedIn()) {
      window.location.hash = '#/';
    }
  }
  
  _setupForm() {
    const registerForm = document.getElementById('register-form');
    const errorContainer = document.getElementById('error-container');
    
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        errorContainer.innerHTML = '';
        
        const registerButton = registerForm.querySelector('button[type="submit"]');
        registerButton.innerHTML = 'Registering...';
        registerButton.disabled = true;
        
        const result = await StoryApi.register({ name, email, password });
        
        if (result.error) {
          errorContainer.innerHTML = `<p>${result.message}</p>`;
          registerButton.innerHTML = 'Register';
          registerButton.disabled = false;
          return;
        }
        
        // Show success message and redirect to login
        errorContainer.innerHTML = `
          <div class="success-message">
            <p>${result.message}. Please login with your new account.</p>
          </div>
        `;
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      } catch (error) {
        errorContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        
        const registerButton = registerForm.querySelector('button[type="submit"]');
        registerButton.innerHTML = 'Register';
        registerButton.disabled = false;
      }
    });
  }
}