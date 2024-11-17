import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
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
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface School {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

interface FormData {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState<FormData>({
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
    if (!user || user.role !== 'super_admin') {
      navigate('/dashboard');
      return;
    }
    fetchSchools();
  }, [navigate]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<School[]>>('http://localhost:3001/api/schools', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setSchools(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching schools',
        severity: 'error',
      });
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setFormData({
      name: '',
      address: '',
      contactNumber: '',
      email: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingSchool) {
        await axios.put(
          `http://localhost:3001/api/schools/${editingSchool.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
      } else {
        await axios.post('http://localhost:3001/api/schools', formData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
      }
      
      setSnackbar({
        open: true,
        message: `School ${editingSchool ? 'updated' : 'added'} successfully`,
        severity: 'success',
      });
      handleClose();
      fetchSchools();
    } catch (error) {
      console.error('Error saving school:', error);
      setSnackbar({
        open: true,
        message: `Error ${editingSchool ? 'updating' : 'adding'} school`,
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        await axios.delete(`http://localhost:3001/api/schools/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setSnackbar({
          open: true,
          message: 'School deleted successfully',
          severity: 'success',
        });
        fetchSchools();
      } catch (error) {
        console.error('Error deleting school:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting school',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Schools Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
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
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>{school.address}</TableCell>
                  <TableCell>{school.contactNumber}</TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell align="right">
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSchool ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="School Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingSchool ? 'Save Changes' : 'Add School'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Schools;
