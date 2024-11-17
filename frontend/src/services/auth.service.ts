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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

interface AuthResponseData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface AuthResponse {
  status: string;
  data: AuthResponseData;
}

class AuthService {
  async login(data: LoginData): Promise<User> {
    try {
      const response = await axios.post<AuthResponse>(API_URL + 'login', data);
      if (response.data?.data?.user && response.data.data.token) {
        const userData: User = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error('Invalid response data');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await axios.post<AuthResponse>(API_URL + 'register', data);
      if (response.data?.data?.user && response.data.data.token) {
        const userData: User = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error('Invalid response data');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (this.isValidUser(userData)) {
          return userData;
        }
        this.logout();
        return null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

  private isValidUser(user: any): user is User {
    return (
      user &&
      typeof user.id === 'string' &&
      typeof user.firstName === 'string' &&
      typeof user.lastName === 'string' &&
      typeof user.email === 'string' &&
      typeof user.role === 'string' &&
      typeof user.token === 'string'
    );
  }
}

export default new AuthService();
