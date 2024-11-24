import axios from 'axios';
import { API_URL } from '../config';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  schoolId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  schoolId: string;
}

class UsersService {
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await axios.post<User>(`${API_URL}/users`, userData);
    return response.data;
  }

  async getUsers(schoolId: string): Promise<User[]> {
    const response = await axios.get<User[]>(`${API_URL}/users`, {
      params: { schoolId }
    });
    return response.data;
  }

  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<User> {
    const response = await axios.put<User>(`${API_URL}/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await axios.delete(`${API_URL}/users/${userId}`);
  }
}

export default new UsersService();
