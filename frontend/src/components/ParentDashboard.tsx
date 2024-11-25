import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../services/api';
import AuthService from '../services/auth.service';
import StudentMedicalForm from './StudentMedicalForm';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  academics: any[];
  medicals: any[];
}

const ParentDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openMedicalForm, setOpenMedicalForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current user and token
        const user = AuthService.getCurrentUser();
        if (!user) {
          setError('User not authenticated');
          return;
        }
        console.log('Current user:', user);
        
        // Make the API request
        console.log('Making request to /students/parent');
        const response = await api.get('/students/parent');
        console.log('Parent students response:', response.data);
        
        if (response.data.data && Array.isArray(response.data.data)) {
          setStudents(response.data.data);
        } else {
          setError('Invalid data format received from server');
          console.error('Invalid data format:', response.data);
        }
      } catch (error: any) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error.response?.data?.message || 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOpenMedicalForm = (student: Student) => {
    setSelectedStudent(student);
    setOpenMedicalForm(true);
  };

  const refreshData = async () => {
    try {
      const response = await api.get('/students/parent');
      setStudents(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to refresh student data');
      console.error('Error refreshing students:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (students.length === 0) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          No students found. If you believe this is an error, please contact support.
        </Alert>
      </Container>
    );
  }

  const renderGrades = (student: Student) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={`${student.firstName} ${student.lastName}`}
          subheader={`Grade: ${student.grade}`}
        />
        <CardContent>
          {student.academics && student.academics.length > 0 ? (
            student.academics.map((academic: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Academic Year: {academic.academicYear}
                </Typography>
                <Typography>Grade: {academic.grade}</Typography>
                <Typography>Section: {academic.section}</Typography>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              No academic records available
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMedical = (student: Student) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={`${student.firstName} ${student.lastName}`}
          action={
            <Button
              variant="contained"
              onClick={() => handleOpenMedicalForm(student)}
            >
              Add Medical Record
            </Button>
          }
        />
        <CardContent>
          {student.medicals && student.medicals.length > 0 ? (
            student.medicals.map((medical: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Condition: {medical.condition}
                </Typography>
                <Typography>Notes: {medical.notes}</Typography>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              No medical records available
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Children
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Academic Information" />
          <Tab label="Medical Records" />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {students.map((student) => (
            <Grid item xs={12} md={6} key={student.id}>
              {renderGrades(student)}
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {students.map((student) => (
            <Grid item xs={12} md={6} key={student.id}>
              {renderMedical(student)}
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openMedicalForm}
        onClose={() => setOpenMedicalForm(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedStudent && (
          <StudentMedicalForm
            studentId={selectedStudent.id}
            onClose={() => setOpenMedicalForm(false)}
            onSuccess={() => {
              setOpenMedicalForm(false);
              window.location.reload();
            }}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default ParentDashboard;
