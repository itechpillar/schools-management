import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface School {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  aadhar_number: string;
  pan_number?: string;
  school: School;
}

interface TeacherFormData {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  aadhar_number: string;
  pan_number?: string;
  school_id?: string;
}

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    aadhar_number: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const user = AuthService.getCurrentUser();
  
  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      navigate('/dashboard');
      return;
    }
    fetchTeachers();
    fetchSchools();
  }, [navigate]);
  
  
  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching teachers',
        severity: 'error'
      });
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools');
      setSchools(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleOpen = (teacher?: Teacher) => {
    if (teacher) {
      setSelectedTeacher(teacher);
      setFormData({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        gender: teacher.gender,
        date_of_birth: teacher.date_of_birth,
        aadhar_number: teacher.aadhar_number,
        pan_number: teacher.pan_number,
        school_id: teacher.school?.id
      });
    } else {
      setSelectedTeacher(null);
      setFormData({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        aadhar_number: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
    setFormData({
      first_name: '',
      last_name: '',
      gender: '',
      date_of_birth: '',
      aadhar_number: '',
    });
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Transform date to ISO format
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        date_of_birth: new Date(formData.date_of_birth).toISOString(),
        aadhar_number: formData.aadhar_number,
        pan_number: formData.pan_number || undefined,
        school_id: formData.school_id
      };

      if (selectedTeacher) {
        await api.put(`/teachers/${selectedTeacher.id}`, payload);
        setSnackbar({
          open: true,
          message: 'Teacher updated successfully',
          severity: 'success'
        });
      } else {
        await api.post('/teachers', payload);
        setSnackbar({
          open: true,
          message: 'Teacher created successfully',
          severity: 'success'
        });
      }
      handleClose();
      fetchTeachers();
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error saving teacher',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/teachers/${id}`);
        setSnackbar({
          open: true,
          message: 'Teacher deleted successfully',
          severity: 'success'
        });
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting teacher',
          severity: 'error'
        });
      }
    }
  };

  const currentUser = AuthService.getCurrentUser();
  const canEdit = currentUser?.role === 'super_admin' || currentUser?.role === 'school_admin';

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">Teachers</Typography>
          {canEdit && (
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
              Add Teacher
            </Button>
          )}
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Aadhar Number</TableCell>
                <TableCell>PAN Number</TableCell>
                <TableCell>School</TableCell>
                {canEdit && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{`${teacher.first_name} ${teacher.last_name}`}</TableCell>
                  <TableCell>{teacher.gender}</TableCell>
                  <TableCell>{new Date(teacher.date_of_birth).toLocaleDateString()}</TableCell>
                  <TableCell>{teacher.aadhar_number}</TableCell>
                  <TableCell>{teacher.pan_number || '-'}</TableCell>
                  <TableCell>{teacher.school?.name || '-'}</TableCell>
                  {canEdit && (
                    <TableCell>
                      <IconButton onClick={() => handleOpen(teacher)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(teacher.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTeacher ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleTextFieldChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleTextFieldChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleTextFieldChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleTextFieldChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="pan_number"
                value={formData.pan_number || ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>School</InputLabel>
                <Select
                  name="school_id"
                  value={formData.school_id || ''}
                  onChange={handleSelectChange}
                  label="School"
                >
                  {schools.map(school => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedTeacher ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Teachers;
