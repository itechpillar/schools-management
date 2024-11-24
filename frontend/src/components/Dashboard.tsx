import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Container,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  Assessment as AssessmentIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  PeopleAlt as StudentsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService, { User } from '../services/auth.service';
import axios from 'axios';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
  roles: string[];
}

interface DashboardStats {
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  activeClasses: number;
}

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '& .MuiListItemButton-root': {
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5, 1),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiListItemIcon-root': {
    color: 'white',
  },
}));

const QuickStatsCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.default,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalSchools: 0,
    totalTeachers: 0,
    totalStudents: 0,
    activeClasses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    fetchDashboardStats(user);
  }, [navigate]);

  const fetchDashboardStats = async (user: User) => {
    try {
      setLoading(true);
      // Fetch schools count
      console.log('Fetching schools with token:', user.token);
      const schoolsResponse = await axios.get('http://localhost:3001/api/schools', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Schools response:', schoolsResponse.data);
      
      // Fetch students count
      const studentsResponse = await axios.get('http://localhost:3001/api/students', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Students response:', studentsResponse.data);
      
      // Update stats with actual schools and students count
      const schoolsCount = schoolsResponse.data.data?.length || 0;
      const studentsCount = studentsResponse.data.data?.length || 0;
      console.log('Schools count:', schoolsCount);
      console.log('Students count:', studentsCount);
      
      setStats(prevStats => ({
        ...prevStats,
        totalSchools: schoolsCount,
        totalStudents: studentsCount,
        // For now, keeping other stats static until we implement their respective endpoints
        totalTeachers: 120,
        activeClasses: 45
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['super_admin', 'school_admin', 'teacher'],
    },
    {
      text: 'Schools',
      icon: <SchoolIcon />,
      path: '/schools',
      roles: ['super_admin'],
    },
    {
      text: 'Students',
      icon: <StudentsIcon />,
      path: '/students',
      roles: ['super_admin','school_admin', 'teacher'],
    },
    {
      text: 'Teachers',
      icon: <PersonIcon />,
      path: '/teachers',
      roles: ['super_admin', 'school_admin'],
    },
    {
      text: 'Classes',
      icon: <ClassIcon />,
      path: '/classes',
      roles: ['super_admin', 'school_admin', 'teacher'],
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/reports',
      roles: ['super_admin', 'school_admin'],
    },
    {
      text: 'Events',
      icon: <EventIcon />,
      path: '/events',
      roles: ['super_admin', 'school_admin', 'teacher'],
    },
  ];

  const quickStats = [
    ...(currentUser?.roles.includes('super_admin') ? [
      { title: 'Total Schools', value: loading ? '...' : stats.totalSchools.toString(), icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: '#1976d2' },
    ] : []),
    { title: 'Active Teachers', value: loading ? '...' : stats.totalTeachers.toString(), icon: <PersonIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
    { title: 'Total Students', value: loading ? '...' : stats.totalStudents.toString(), icon: <PersonIcon sx={{ fontSize: 40 }} />, color: '#ed6c02' },
    { title: 'Active Classes', value: loading ? '...' : stats.activeClasses.toString(), icon: <ClassIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' },
  ];

  const recentActivities = [
    { type: 'New Student', message: 'John Doe joined Class 10A', time: '2 hours ago' },
    { type: 'Event', message: 'Annual Sports Day scheduled for next month', time: '5 hours ago' },
    { type: 'Report', message: 'Monthly attendance report generated', time: '1 day ago' },
  ];

  const renderDashboardContent = () => {
    if (!currentUser) return null;

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Quick Stats */}
          {currentUser.roles.includes('super_admin') && (
            <Grid item xs={12} md={3}>
              <QuickStatsCard>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Schools
                  </Typography>
                  <Typography variant="h4">{stats.totalSchools}</Typography>
                </CardContent>
              </QuickStatsCard>
            </Grid>
          )}
          
          <Grid item xs={12} md={3}>
            <QuickStatsCard>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Students
                </Typography>
                <Typography variant="h4">{stats.totalStudents}</Typography>
              </CardContent>
            </QuickStatsCard>
          </Grid>

          {/* Quick Actions for School Admin */}
          {currentUser.roles.includes('school_admin') && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<StudentsIcon />}
                      onClick={() => navigate('/students')}
                    >
                      Manage Students
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            School Management System
          </Typography>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2 }}>
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              SMS
            </Typography>
            <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        <Box sx={{ px: 2, py: 2 }}>
          <Chip
            avatar={<Avatar>{currentUser?.first_name?.charAt(0) || 'U'}</Avatar>}
            label={currentUser?.roles[0]?.replace('_', ' ').toUpperCase() || 'USER'}
            sx={{ 
              width: '100%', 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '& .MuiChip-avatar': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
              }
            }}
          />
        </Box>
        <List>
          {menuItems.map((item) => (
            item.roles.includes(currentUser?.roles[0] || '') && (
              <StyledListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </StyledListItem>
            )
          ))}
          <StyledListItem key="logout" disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </StyledListItem>
        </List>
      </StyledDrawer>

      <Main open={open}>
        <DrawerHeader />
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h4" gutterBottom>
                Welcome back, {currentUser?.first_name || 'User'}!
              </Typography>
              <Typography variant="subtitle1">
                Here's what's happening in your school today
              </Typography>
            </Paper>
          </Grid>

          {/* Quick Stats */}
          {quickStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <QuickStatsCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: stat.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stat.value}
                      </Typography>
                      <Typography color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </QuickStatsCard>
            </Grid>
          ))}

          {/* Recent Activities */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem 
                    key={index}
                    sx={{
                      borderLeft: '4px solid',
                      borderColor: index === 0 ? '#1976d2' : index === 1 ? '#2e7d32' : '#ed6c02',
                      mb: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
        {renderDashboardContent()}
      </Main>
    </Box>
  );
};

export default Dashboard;
