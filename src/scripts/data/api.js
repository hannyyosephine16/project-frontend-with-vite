import CONFIG from '../config';

const API = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

class StoryApi {
  static async register({ name, email, password }) {
    const response = await fetch(API.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    
    return await response.json();
  }

  static async login({ email, password }) {
    const response = await fetch(API.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    return await response.json();
  }

  static async getStories({ token, page, size, location = 0 }) {
    let url = API.GET_STORIES;
    const params = new URLSearchParams();
    
    if (page) params.append('page', page);
    if (size) params.append('size', size);
    if (location !== undefined) params.append('location', location);
    
    if (params.toString()) {
      url = `${url}?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await response.json();
  }

  static async getStoryDetail({ token, id }) {
    const response = await fetch(API.GET_STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return await response.json();
  }

  static async addStory({ token, description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);
    
    const response = await fetch(API.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    return await response.json();
  }

  static async addStoryAsGuest({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);
    
    const response = await fetch(API.ADD_STORY_GUEST, {
      method: 'POST',
      body: formData,
    });
    
    return await response.json();
  }

  static async subscribeNotification({ token, endpoint, keys }) {
    const response = await fetch(API.SUBSCRIBE_NOTIFICATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint,
        keys,
      }),
    });
    
    return await response.json();
  }

  static async unsubscribeNotification({ token, endpoint }) {
    const response = await fetch(API.UNSUBSCRIBE_NOTIFICATION, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint,
      }),
    });
    
    return await response.json();
  }
}

export default StoryApi;