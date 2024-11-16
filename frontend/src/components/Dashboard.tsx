import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
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
} from '@mui/icons-material';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    console.log('User Data:', userData);
    if (!userData || !userData.user) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  if (!user || !user.user) {
    navigate('/login');
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    switch (user.user.role) {
      case 'super_admin':
        menuItems.push(
          { text: 'Schools', icon: <SchoolIcon />, path: '/schools' },
          { text: 'Users', icon: <PersonIcon />, path: '/users' }
        );
        break;
      case 'school_admin':
        menuItems.push(
          { text: 'Teachers', icon: <PersonIcon />, path: '/teachers' },
          { text: 'Students', icon: <PersonIcon />, path: '/students' },
          { text: 'Health Staff', icon: <HealthIcon />, path: '/health-staff' }
        );
        break;
      case 'teacher':
        menuItems.push(
          { text: 'Students', icon: <PersonIcon />, path: '/students' },
          { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' }
        );
        break;
      case 'health_staff':
        menuItems.push(
          { text: 'Health Records', icon: <HealthIcon />, path: '/health-records' },
          { text: 'Students', icon: <PersonIcon />, path: '/students' }
        );
        break;
      case 'student':
        menuItems.push(
          { text: 'Assignments', icon: <AssignmentIcon />, path: '/assignments' },
          { text: 'Health Records', icon: <HealthIcon />, path: '/my-health-records' }
        );
        break;
      case 'parent':
        menuItems.push(
          { text: 'Children', icon: <PersonIcon />, path: '/children' },
          { text: 'Health Records', icon: <HealthIcon />, path: '/children-health-records' }
        );
        break;
    }
    console.log('Menu Items:', menuItems);
    return menuItems;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          School Management
        </Typography>
      </Toolbar>
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.text} onClick={() => navigate(item.path)} component="button">
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem onClick={handleLogout} component="button">
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

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
          <Typography variant="h6" noWrap component="div">
            Welcome, {user.user.firstName} {user.user.lastName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <Typography variant="h4" gutterBottom>
                  {user.user.role === 'super_admin'
                    ? 'System Overview'
                    : user.user.role === 'school_admin'
                    ? 'School Overview'
                    : user.user.role === 'teacher'
                    ? 'Class Overview'
                    : user.user.role === 'health_staff'
                    ? 'Health Records Overview'
                    : user.user.role === 'student'
                    ? 'Student Dashboard'
                    : 'Parent Dashboard'}
                </Typography>
                <Typography variant="body1" paragraph>
                  Welcome to your dashboard. Use the menu on the left to navigate through
                  different sections based on your role.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(getMenuItems()[1]?.path || '/dashboard')}
                  >
                    View {getMenuItems()[1]?.text || 'Dashboard'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
