import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface School {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user || user.user.role !== 'super_admin') {
      navigate('/dashboard');
      return;
    }
    fetchSchools();
  }, [navigate]);

  const fetchSchools = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/schools', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSchools(response.data.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      showSnackbar('Error fetching schools', 'error');
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEditingSchool(null);
    setFormData({
      name: '',
      address: '',
      contactNumber: '',
      email: '',
    });
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      contactNumber: school.contactNumber,
      email: school.email,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSchool(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      console.log('User token:', user.token);
      
      if (editingSchool) {
        const response = await axios.put(
          `http://localhost:3001/api/schools/${editingSchool.id}`,
          formData,
          {
            headers: { 
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        console.log('Update response:', response.data);
        showSnackbar('School updated successfully', 'success');
      } else {
        console.log('Making POST request to create school');
        const response = await axios.post(
          'http://localhost:3001/api/schools',
          formData,
          {
            headers: { 
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        console.log('Create response:', response.data);
        showSnackbar('School added successfully', 'success');
      }
      handleClose();
      fetchSchools();
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      showSnackbar(
        `Error ${editingSchool ? 'updating' : 'adding'} school: ${error.response?.data?.message || error.message}`,
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        await axios.delete(`http://localhost:3001/api/schools/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        showSnackbar('School deleted successfully', 'success');
        fetchSchools();
      } catch (error: any) {
        console.error('Error deleting school:', error.response?.data || error);
        showSnackbar(`Error deleting school: ${error.response?.data?.message || error.message}`, 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Schools Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add School
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school) => (
              <TableRow key={school.id}>
                <TableCell>{school.name}</TableCell>
                <TableCell>{school.address}</TableCell>
                <TableCell>{school.contactNumber}</TableCell>
                <TableCell>{school.email}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(school)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(school.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingSchool ? 'Edit School' : 'Add New School'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="School Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                margin="normal"
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingSchool ? 'Update' : 'Add'} School
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Schools;
