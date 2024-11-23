import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Pagination,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import api from '../services/api';
import StudentForm from './StudentForm';

interface StudentResponse {
  id: number | string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  date_of_birth?: string;
  dateOfBirth?: string;
  gender?: string;
  school?: {
    id: string | number;
    name: string;
  };
  school_id?: string;
  schoolId?: string;
  grade?: string;
  status?: 'active' | 'inactive';
  school_name?: string;
}

interface Student {
  id: number | string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  schoolId: string;
  grade: string;
  status: 'active' | 'inactive';
  schoolName: string;
}

interface School {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchStudents();
    fetchSchools();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      const studentsData: StudentResponse[] = Array.isArray(response.data.data) ? response.data.data : [];
      setStudents(studentsData.map((student: StudentResponse): Student => ({
        id: student.id,
        firstName: student.firstName || student.first_name || '',
        lastName: student.lastName || student.last_name || '',
        dateOfBirth: formatDate(student.dateOfBirth || student.date_of_birth),
        gender: student.gender || '',
        grade: student.grade || '',
        schoolId: student.school?.id?.toString() || student.schoolId || student.school_id || '',
        status: student.status || 'active',
        schoolName: student.school?.name || student.school_name || 'N/A'
      })));
    } catch (error) {
      console.error('Error fetching students:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching students',
        severity: 'error',
      });
      setStudents([]);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      // Parse the date string
      const [year, month, day] = dateString.split(/[-\/]/);
      // Create date in UTC to avoid timezone issues
      const date = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,  // Month is 0-based
        parseInt(day),
        12  // Set to noon UTC
      ));
      
      if (isNaN(date.getTime())) return '';
      
      // Format as YYYY-MM-DD
      const yyyy = date.getUTCFullYear();
      const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(date.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return '';
    }
  };

  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getUTCFullYear();
      console.log(date,day, month, year);
      
      return `${day}-${month}-${year}`;
    } catch {
      return '';
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools');
      setSchools(response.data.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleClickOpen = () => {
    setEditingStudent(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStudent(null);
  };

  const handleSave = async (formData: any) => {
    try {
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      setSnackbar({
        open: true,
        message: `Error ${editingStudent ? 'updating' : 'adding'} student`,
        severity: 'error',
      });
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent({
      ...student,
      dateOfBirth: formatDate(student.dateOfBirth)
    });
    setOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        setSnackbar({
          open: true,
          message: 'Student deleted successfully',
          severity: 'success',
        });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        setSnackbar({
          open: true,
          message: 'Error deleting student',
          severity: 'error',
        });
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (student?.firstName?.toLowerCase() || '').includes(searchTermLower) ||
      (student?.lastName?.toLowerCase() || '').includes(searchTermLower) ||
      (student?.grade?.toLowerCase() || '').includes(searchTermLower)
    );
  });

  const handlePageChange = (event: unknown, value: number) => {
    setPage(value);
  };

  const studentsPerPage = 10;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const displayedStudents = filteredStudents.slice(
    (page - 1) * studentsPerPage,
    page * studentsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate('/dashboard')}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
              Dashboard
            </Link>
            <Typography color="text.primary">Students Management</Typography>
          </Breadcrumbs>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Student
          </Button>
        </Box>

        <TextField
          label="Search Students"
          variant="outlined"
          size="small"
          sx={{ mb: 2, maxWidth: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{formatDisplayDate(student.dateOfBirth)}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.schoolName}</TableCell>
                  <TableCell>{student.status}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(student)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(student.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>

      <StudentForm
        open={open}
        handleClose={handleClose}
        onComplete={handleSave}
        editingStudent={editingStudent}
        schools={schools}
      />

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

export default Students;
