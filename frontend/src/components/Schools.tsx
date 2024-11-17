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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
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

type Order = 'asc' | 'desc';
type OrderBy = keyof Omit<School, 'id'>;

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

  // Sorting function
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sorting logic
  const sortedSchools = [...schools].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return b[orderBy] > a[orderBy] ? 1 : -1;
    }
  });

  // Search logic
  const filteredSchools = sortedSchools.filter((school) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      school.name.toLowerCase().includes(searchLower) ||
      school.address.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const paginatedSchools = filteredSchools.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const SortableTableCell: React.FC<{
    property: OrderBy;
    label: string;
    sx?: React.CSSProperties | any;
  }> = ({ property, label, sx }) => (
    <TableCell sx={sx}>
      <TableSortLabel
        active={orderBy === property}
        direction={orderBy === property ? order : 'asc'}
        onClick={() => handleRequestSort(property)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
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
          <Typography color="text.primary">Schools Management</Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by school name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <SortableTableCell 
                property="name" 
                label="Name" 
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  fontSize: '0.95rem',
                }}
              />
              <SortableTableCell 
                property="address" 
                label="Address"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  fontSize: '0.95rem',
                }}
              />
              <SortableTableCell 
                property="contactNumber" 
                label="Contact"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  fontSize: '0.95rem',
                }}
              />
              <SortableTableCell 
                property="email" 
                label="Email"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  fontSize: '0.95rem',
                }}
              />
              <TableCell 
                align="right"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  fontSize: '0.95rem',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} thickness={4} />
                </TableCell>
              </TableRow>
            ) : paginatedSchools.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  align="center" 
                  sx={{ 
                    py: 4,
                    color: 'text.secondary',
                    fontSize: '1rem',
                  }}
                >
                  {searchQuery ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <SearchIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                      </Box>
                      No schools found matching your search
                    </>
                  ) : (
                    'No schools found'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedSchools.map((school, index) => (
                <TableRow 
                  key={school.id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                    '&:hover': { 
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      transition: 'background-color 0.2s ease',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell 
                    sx={{ 
                      fontWeight: 500,
                      borderLeft: '4px solid transparent',
                      '&:hover': {
                        borderLeft: '4px solid #1976d2',
                      },
                      transition: 'border-left 0.2s ease',
                    }}
                  >
                    {school.name}
                  </TableCell>
                  <TableCell>{school.address}</TableCell>
                  <TableCell>{school.contactNumber}</TableCell>
                  <TableCell>{school.email}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(school)}
                      size="small"
                      sx={{ 
                        mr: 1,
                        '&:hover': { 
                          backgroundColor: 'rgba(25, 118, 210, 0.12)',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(school.id)}
                      size="small"
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(211, 47, 47, 0.12)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSchools.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            backgroundColor: '#f5f5f5',
          }}
        />
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
