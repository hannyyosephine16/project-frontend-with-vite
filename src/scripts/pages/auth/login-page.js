import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="container">
          <div class="auth-container">
            <div class="auth-header">
              <h1>Login to Dicoding Stories</h1>
              <p>Welcome back! Please sign in to your account.</p>
            </div>
            
            <form id="login-form" class="auth-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="Enter your email address" 
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
                <button type="submit" id="login-button" class="primary-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10,17 15,12 10,7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Login
                </button>
              </div>
            </form>
            
            <div class="auth-footer">
              <p>Don't have an account? <a href="#/register">Create new account</a></p>
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
    
    // Focus on email input for better UX
    setTimeout(() => {
      document.getElementById('email').focus();
    }, 100);
  }
  
  _setupForm() {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const errorContainer = document.getElementById('error-container');
    
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      // Basic validation
      if (!email || !password) {
        this._showError('Please fill in all fields');
        return;
      }
      
      if (!this._isValidEmail(email)) {
        this._showError('Please enter a valid email address');
        return;
      }
      
      if (password.length < 8) {
        this._showError('Password must be at least 8 characters long');
        return;
      }
      
      await this._handleLogin(email, password);
    });
    
    // Handle Enter key on form inputs
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !loginButton.disabled) {
          loginForm.dispatchEvent(new Event('submit'));
        }
      });
    });
  }
  
  async _handleLogin(email, password) {
    const loginButton = document.getElementById('login-button');
    const errorContainer = document.getElementById('error-container');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    try {
      // Clear previous errors
      errorContainer.innerHTML = '';
      
      // Update button to loading state
      this._setButtonLoading(loginButton, true);
      
      // Disable form inputs
      emailInput.disabled = true;
      passwordInput.disabled = true;
      
      // Call login API
      const result = await StoryApi.login({ email, password });
      
      if (result.error) {
        throw new Error(result.message);
      }
      
      // Save auth data
      AuthStore.saveAuth({
        userId: result.loginResult.userId,
        name: result.loginResult.name,
        token: result.loginResult.token,
      });
      
      // Show success message
      this._showSuccess('Login successful! Redirecting...');
      
      // Update button to success state
      this._setButtonSuccess(loginButton);
      
      // Redirect to home after short delay
      setTimeout(() => {
        window.location.hash = '#/';
        window.location.reload(); // Reload to update navigation
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error message
      this._showError(error.message || 'Login failed. Please check your credentials and try again.');
      
      // Reset button and form
      this._setButtonLoading(loginButton, false);
      emailInput.disabled = false;
      passwordInput.disabled = false;
      
      // Focus back to email input
      emailInput.focus();
    }
  }
  
  _setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.innerHTML = `
        <div class="loading-spinner"></div>
        Logging in...
      `;
      button.disabled = true;
      button.classList.add('loading');
    } else {
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10,17 15,12 10,7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        Login
      `;
      button.disabled = false;
      button.classList.remove('loading');
    }
  }
  
  _setButtonSuccess(button) {
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22,4 12,14.01 9,11.01"></polyline>
      </svg>
      Login Successful!
    `;
    button.classList.remove('loading');
    button.classList.add('success');
  }
  
  _showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `
      <div class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <p>${message}</p>
      </div>
    `;
  }
  
  _showSuccess(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `
      <div class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22,4 12,14.01 9,11.01"></polyline>
        </svg>
        <p>${message}</p>
      </div>
    `;
  }
  
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}