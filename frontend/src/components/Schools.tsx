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
  Breadcrumbs,
  Link,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axios.config';

import API_URL from '../config/api.config';

interface School {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface FormData {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  includeAdmin?: boolean;
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminPassword?: string;
}

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof Omit<School, 'id'>;

const Schools: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
  });
  const [adminFormData, setAdminFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('name');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if (!user || !user.roles.includes('super_admin')) {
      navigate('/dashboard');
      return;
    }
    fetchSchools();
  }, [navigate]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiResponse<School[]>>('/schools');
      setSchools(response.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch schools',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        name: school.name,
        address: school.address,
        contactNumber: school.contactNumber,
        email: school.email,
      });
    } else {
      setEditingSchool(null);
      setFormData({
        name: '',
        address: '',
        contactNumber: '',
        email: '',
      });
    }
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
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      adminPassword: '',
      includeAdmin: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingSchool) {
        await axiosInstance.put(`/schools/${editingSchool.id}`, {
          name: formData.name,
          address: formData.address,
          contactNumber: formData.contactNumber,
          email: formData.email,
        });
        setSnackbar({
          open: true,
          message: 'School updated successfully',
          severity: 'success',
        });
      } else {
        // Create school first
        const schoolResponse = await axiosInstance.post<ApiResponse<School>>('/schools', {
          name: formData.name,
          address: formData.address,
          contactNumber: formData.contactNumber,
          email: formData.email,
        });

        // If admin details are included, create admin user
        if (formData.includeAdmin) {
          await axiosInstance.post('/users', {
            firstName: formData.adminFirstName,
            lastName: formData.adminLastName,
            email: formData.adminEmail,
            password: formData.adminPassword,
            roles: ['school_admin'],
            schoolId: schoolResponse.data.data.id,
          });
          setSnackbar({
            open: true,
            message: 'School and admin created successfully',
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'School created successfully',
            severity: 'success',
          });
        }
      }
      handleClose();
      fetchSchools();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save school',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/schools/${id}`);
        setSnackbar({
          open: true,
          message: 'School deleted successfully',
          severity: 'success',
        });
        fetchSchools();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete school',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Admin Dialog Handlers
  const handleAdminDialogOpen = (school: School) => {
    setSelectedSchool(school);
    setAdminFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    setAdminDialogOpen(true);
  };

  const handleAdminDialogClose = () => {
    setAdminDialogOpen(false);
    setSelectedSchool(null);
    setAdminFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };

  const handleAdminFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    try {
      setLoading(true);
      await axiosInstance.post('/users', {
        ...adminFormData,
        roles: ['school_admin'],
        schoolId: selectedSchool.id,
      });

      setSnackbar({
        open: true,
        message: 'School admin assigned successfully',
        severity: 'success',
      });
      handleAdminDialogClose();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to assign school admin',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Sorting functions
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedSchools = React.useMemo(() => {
    const filtered = schools.filter(school =>
      Object.values(school).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (order === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [schools, order, orderBy, searchQuery]);

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 3 }}>
        <Breadcrumbs>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/dashboard')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
            Back to Dashboard
          </Link>
          <Typography color="text.primary">Schools</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Schools Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add School
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search schools..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['name', 'address', 'contactNumber', 'email'].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    onClick={() => handleRequestSort(column as OrderBy)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSchools
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.name}</TableCell>
                  <TableCell>{school.address}</TableCell>
                  <TableCell>{school.contactNumber}</TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PersonIcon />}
                      onClick={() => handleAdminDialogOpen(school)}
                      size="small"
                    >
                      Assign Admin
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(school)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(school.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedSchools.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* School Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchool ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Typography variant="h6" gutterBottom>School Information</Typography>
            <TextField
              margin="dense"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />

            {!editingSchool && (
              <>
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>School Admin</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.includeAdmin}
                        onChange={(e) => setFormData(prev => ({ ...prev, includeAdmin: e.target.checked }))}
                        name="includeAdmin"
                      />
                    }
                    label="Create School Admin"
                  />
                </Box>

                {formData.includeAdmin && (
                  <Box sx={{ ml: 2 }}>
                    <TextField
                      margin="dense"
                      label="Admin First Name"
                      name="adminFirstName"
                      value={formData.adminFirstName}
                      onChange={handleChange}
                      fullWidth
                      required={formData.includeAdmin}
                    />
                    <TextField
                      margin="dense"
                      label="Admin Last Name"
                      name="adminLastName"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      fullWidth
                      required={formData.includeAdmin}
                    />
                    <TextField
                      margin="dense"
                      label="Admin Email"
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      fullWidth
                      required={formData.includeAdmin}
                    />
                    <TextField
                      margin="dense"
                      label="Admin Password"
                      type="password"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      fullWidth
                      required={formData.includeAdmin}
                    />
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : editingSchool ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Admin Assignment Dialog */}
      <Dialog open={adminDialogOpen} onClose={handleAdminDialogClose}>
        <DialogTitle>
          Assign Admin to {selectedSchool?.name}
        </DialogTitle>
        <form onSubmit={handleAssignAdmin}>
          <DialogContent>
            <TextField
              margin="dense"
              label="First Name"
              name="firstName"
              value={adminFormData.firstName}
              onChange={handleAdminFormChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Last Name"
              name="lastName"
              value={adminFormData.lastName}
              onChange={handleAdminFormChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              name="email"
              value={adminFormData.email}
              onChange={handleAdminFormChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              name="password"
              value={adminFormData.password}
              onChange={handleAdminFormChange}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAdminDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Assign Admin'}
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