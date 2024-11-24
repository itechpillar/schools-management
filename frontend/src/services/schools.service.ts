import axios from 'axios';
import { API_URL } from '../config';

interface School {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
}

class SchoolsService {
  async getAllSchools(): Promise<School[]> {
    const response = await axios.get<School[]>(`${API_URL}/schools`);
    return response.data;
  }

  async createSchool(schoolData: Partial<School>): Promise<School> {
    const response = await axios.post<School>(`${API_URL}/schools`, schoolData);
    return response.data;
  }

  async updateSchool(id: string, schoolData: Partial<School>): Promise<School> {
    const response = await axios.put<School>(`${API_URL}/schools/${id}`, schoolData);
    return response.data;
  }

  async deleteSchool(id: string): Promise<any> {
    const response = await axios.delete(`${API_URL}/schools/${id}`);
    return response.data;
  }
}

export default new SchoolsService();