import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(API_URL + 'login', data);
    if (response.data.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(API_URL + 'register', data);
    if (response.data.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      console.log('Current User Data:', userData);
      return userData;
    }
    return null;
  }
}

export default new AuthService();
