import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../services/api';

interface ParentRegistrationProps {
  onSuccess?: () => void;
}

const ParentRegistration: React.FC<ParentRegistrationProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(
    'To register as a parent, your email must be registered with your child\'s school record. Please contact your school administrator if you haven\'t provided your email yet.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // First check if email exists in student records
      const checkResponse = await api.get('/students/parent-email-check', {
        params: { email: formData.email }
      });

      if (!checkResponse.data.exists) {
        setError('This email is not registered with any student records. Please contact your school administrator.');
        setInfoMessage('Your email must be registered in your child\'s school record before you can create a parent account.');
        return;
      }

      // Register parent
      const response = await api.post('/auth/register', {
        ...formData,
        roles: ['parent']
      });

      if (response.data.success) {
        setSuccess(true);
        setInfoMessage('Registration successful! You will be redirected to login...');
        if (onSuccess) {
          onSuccess();
        }
        // Clear form data
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
        });
        // Show success message and redirect after a delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login with your credentials.',
              email: formData.email 
            } 
          });
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      if (error.response?.status === 409) {
        setInfoMessage('An account with this email already exists. Please try logging in instead.');
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Parent Registration
        </Typography>
        
        {infoMessage && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {infoMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            required
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={handleChange('email')}
            type="email"
            helperText="Use the same email that was provided to your child's school"
          />
          <TextField
            required
            fullWidth
            label="First Name"
            margin="normal"
            value={formData.firstName}
            onChange={handleChange('firstName')}
          />
          <TextField
            required
            fullWidth
            label="Last Name"
            margin="normal"
            value={formData.lastName}
            onChange={handleChange('lastName')}
          />
          <TextField
            required
            fullWidth
            label="Phone Number"
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
          />
          <TextField
            required
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
          />
          <TextField
            required
            fullWidth
            label="Confirm Password"
            margin="normal"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            variant="text"
            fullWidth
            sx={{ mt: 1 }}
          >
            Already have an account? Sign in
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccess(false);
        }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Registration successful! Redirecting to login...'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ParentRegistration;
