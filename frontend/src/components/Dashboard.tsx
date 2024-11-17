import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService, { User } from '../services/auth.service';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocalHospital as HealthIcon,
  Assignment as AssignmentIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const formatRole = (role: string | undefined): string => {
    if (!role) return 'User';
    return role.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  };

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
      },
    ];

    if (currentUser?.role === 'super_admin') {
      items.push({
        text: 'Schools',
        icon: <SchoolIcon />,
        path: '/schools',
      });
    }

    if (currentUser?.role === 'school_admin' || currentUser?.role === 'super_admin') {
      items.push(
        {
          text: 'Teachers',
          icon: <PersonIcon />,
          path: '/teachers',
        },
        {
          text: 'Health Staff',
          icon: <HealthIcon />,
          path: '/health-staff',
        }
      );
    }

    if (currentUser?.role === 'teacher') {
      items.push({
        text: 'Assignments',
        icon: <AssignmentIcon />,
        path: '/assignments',
      });
    }

    return items;
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {getMenuItems().map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={window.location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  if (!currentUser) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentUser.role === 'super_admin' && window.location.pathname === '/schools'
              ? 'Schools Management'
              : 'Dashboard'}
          </Typography>
          {currentUser.role === 'super_admin' && window.location.pathname === '/schools' && (
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => navigate('/schools/add')}
            >
              Add School
            </Button>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Typography variant="body2">
              {currentUser ? formatRole(currentUser.role) : 'User'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 240,
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Welcome, {currentUser.firstName}!
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Role: {formatRole(currentUser.role)}
                </Typography>
                <Typography variant="body1" paragraph>
                  This is your dashboard. You can access all your permitted functions from the menu on the left.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
