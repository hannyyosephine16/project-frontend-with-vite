class AuthStore {
  static AUTH_KEY = 'dicoding_story_auth';

  static saveAuth({ userId, name, token }) {
    localStorage.setItem(
      this.AUTH_KEY,
      JSON.stringify({
        userId,
        name,
        token,
      }),
    );
  }

  static getAuth() {
    const auth = localStorage.getItem(this.AUTH_KEY);
    
    if (!auth) {
      return null;
    }
    
    return JSON.parse(auth);
  }

  static destroyAuth() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  static isLoggedIn() {
    return !!this.getAuth();
  }
}

export default AuthStore;