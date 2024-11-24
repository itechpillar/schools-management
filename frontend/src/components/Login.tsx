import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Alert,
  Paper,
} from '@mui/material';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      navigate('/dashboard');
    }
    
    // Handle registration success state
    const state = location.state as { message?: string; email?: string } | null;
    if (state?.message) {
      setSuccessMessage(state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
    if (state?.email) {
      setEmail(state.email);
    }
  }, [navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await AuthService.login({ email, password });
      if (user && user.roles.length > 0) {
        console.log('User roles:', user.roles);
        // Redirect parents to parent dashboard, others to regular dashboard
        if (user.roles.includes('parent')) {
          navigate('/parent-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid user role');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
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
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            School Management System
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Sign In
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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
          </Box>
          {/* Temporarily comment out regular registration */}
          {/* <Button
            component={RouterLink}
            to="/register"
            variant="text"
            fullWidth
            sx={{ mt: 1 }}
          >
            Don't have an account? Register
          </Button> */}
          <Button
            component={RouterLink}
            to="/parent-register"
            variant="text"
            fullWidth
            sx={{ mt: 1 }}
          >
            Parent Registration
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
