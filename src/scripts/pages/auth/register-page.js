import StoryApi from '../../data/api';
import AuthStore from '../../data/auth-store';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="container">
          <div class="auth-container">
            <div class="auth-header">
              <h1>Create Your Account</h1>
              <p>Join the Dicoding Stories community and start sharing your experiences!</p>
            </div>
            
            <form id="register-form" class="auth-form">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="Enter your full name" 
                  autocomplete="name"
                />
              </div>
              
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
                  placeholder="Create a strong password (min. 8 characters)" 
                  autocomplete="new-password" 
                  minlength="8"
                />
                <small class="password-hint">Password must be at least 8 characters long</small>
              </div>
              
              <div id="error-container" class="error-container"></div>
              
              <div class="auth-actions">
                <button type="submit" id="register-button" class="primary-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Create Account
                </button>
              </div>
            </form>
            
            <div class="auth-footer">
              <p>Already have an account? <a href="#/login">Sign in here</a></p>
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
    
    // Focus on name input for better UX
    setTimeout(() => {
      document.getElementById('name').focus();
    }, 100);
  }
  
  _setupForm() {
    const registerForm = document.getElementById('register-form');
    const registerButton = document.getElementById('register-button');
    const errorContainer = document.getElementById('error-container');
    
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      // Validate inputs
      if (!name || !email || !password) {
        this._showError('Please fill in all fields');
        return;
      }
      
      if (name.length < 2) {
        this._showError('Name must be at least 2 characters long');
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
      
      if (!this._isStrongPassword(password)) {
        this._showError('Password should contain at least one letter and one number');
        return;
      }
      
      await this._handleRegister(name, email, password);
    });
    
    // Handle Enter key on form inputs
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !registerButton.disabled) {
          registerForm.dispatchEvent(new Event('submit'));
        }
      });
    });
    
    // Real-time password validation
    const passwordInput = document.getElementById('password');
    const passwordHint = document.querySelector('.password-hint');
    
    passwordInput.addEventListener('input', (event) => {
      const password = event.target.value;
      if (password.length === 0) {
        passwordHint.textContent = 'Password must be at least 8 characters long';
        passwordHint.className = 'password-hint';
      } else if (password.length < 8) {
        passwordHint.textContent = `Password too short (${password.length}/8 characters)`;
        passwordHint.className = 'password-hint weak';
      } else if (!this._isStrongPassword(password)) {
        passwordHint.textContent = 'Password should contain letters and numbers';
        passwordHint.className = 'password-hint medium';
      } else {
        passwordHint.textContent = 'Strong password ✓';
        passwordHint.className = 'password-hint strong';
      }
    });
  }
  
  async _handleRegister(name, email, password) {
    const registerButton = document.getElementById('register-button');
    const errorContainer = document.getElementById('error-container');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    try {
      // Clear previous errors
      errorContainer.innerHTML = '';
      
      // Update button to loading state
      this._setButtonLoading(registerButton, true);
      
      // Disable form inputs
      nameInput.disabled = true;
      emailInput.disabled = true;
      passwordInput.disabled = true;
      
      // Call register API
      const result = await StoryApi.register({ name, email, password });
      
      if (result.error) {
        throw new Error(result.message);
      }
      
      // Show success message
      this._showSuccess('Account created successfully! Redirecting to login...');
      
      // Update button to success state
      this._setButtonSuccess(registerButton);
      
      // Redirect to login page after delay
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error message
      this._showError(error.message || 'Registration failed. Please try again.');
      
      // Reset button and form
      this._setButtonLoading(registerButton, false);
      nameInput.disabled = false;
      emailInput.disabled = false;
      passwordInput.disabled = false;
      
      // Focus back to name input
      nameInput.focus();
    }
  }
  
  _setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.innerHTML = `
        <div class="loading-spinner"></div>
        Creating Account...
      `;
      button.disabled = true;
      button.classList.add('loading');
    } else {
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
        Create Account
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
      Account Created!
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
  
  _isStrongPassword(password) {
    // Check if password contains at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
  }
}