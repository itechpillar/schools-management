import axiosInstance from '../utils/axios.config';
import API_URL from '../config/api.config';

const AUTH_URL = `${API_URL}/auth`;

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface User {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
  token: string;
  schoolId?: string; // Add schoolId for school_admin users
}

interface AuthResponseData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: { name: string }[];
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
      const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
      if (response.data?.data?.user && response.data.data.token) {
        const userData: User = {
          userId: response.data.data.user.id,
          first_name: response.data.data.user.firstName,
          last_name: response.data.data.user.lastName,
          email: response.data.data.user.email,
          roles: response.data.data.user.roles.map(role => role.name),
          token: response.data.data.token,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.data.token);
        return userData;
      }
      throw new Error('Invalid response from server');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  }

  async register(data: RegisterData): Promise<void> {
    try {
      await axiosInstance.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roles: data.roles,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      try {
        const userData = JSON.parse(userStr);
        if (this.isValidUser(userData) && userData.token === token) {
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
      typeof user.userId === 'string' &&
      typeof user.first_name === 'string' &&
      typeof user.last_name === 'string' &&
      typeof user.email === 'string' &&
      Array.isArray(user.roles) &&
      user.roles.every((role: string) => typeof role === 'string') &&
      typeof user.token === 'string' &&
      (user.schoolId === undefined || typeof user.schoolId === 'string')
    );
  }

  private handleError(error: any): void {
    console.error('Error:', error);
  }
}

export default new AuthService();
