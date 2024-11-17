import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService, { User } from '../services/auth.service';
import { Box, Button, TextField, Typography, Container, Alert, Paper } from '@mui/material';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await AuthService.login({ email, password });
      if (user && user.role) {
        navigate('/dashboard');
      } else {
        setError('Invalid user role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (role: string) => {
    setError('');
    setLoading(true);

    const testCredentials = {
      'super_admin': { email: 'admin@school.com', password: 'admin123' },
      'teacher': { email: 'teacher@school.com', password: 'teacher123' },
      'student': { email: 'student@school.com', password: 'student123' },
    }[role];

    if (testCredentials) {
      try {
        const user = await AuthService.login(testCredentials);
        if (user && user.role) {
          navigate('/dashboard');
        } else {
          setError('Invalid user role');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred during login');
      }
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          School Management System
        </Typography>
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2 }}>
          <Typography component="h2" variant="h6" gutterBottom>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Test Accounts
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleTestLogin('super_admin')}
                disabled={loading}
              >
                Super Admin
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleTestLogin('teacher')}
                disabled={loading}
              >
                Teacher
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleTestLogin('student')}
                disabled={loading}
              >
                Student
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
