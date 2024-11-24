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
        const response = await api.get('/students/parent');
        setStudents(response.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch student data');
        console.error('Error fetching students:', error);
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

  const renderGrades = (student: Student) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={`${student.firstName} ${student.lastName}`}
          subheader={`Grade: ${student.grade}`}
        />
        <CardContent>
          {student.academics.map((academic: any, index: number) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Academic Year: {academic.academicYear}
              </Typography>
              <Typography>Grade: {academic.grade}</Typography>
              <Typography>Section: {academic.section}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderMedical = (student: Student) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={`${student.firstName} ${student.lastName}`}
          subheader="Medical Information"
          action={
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenMedicalForm(student)}
            >
              Update Medical Info
            </Button>
          }
        />
        <CardContent>
          {student.medicals.map((medical: any, index: number) => (
            <Box key={index}>
              <Typography>Blood Group: {medical.blood_group}</Typography>
              <Typography>Medical Conditions: {medical.medical_conditions}</Typography>
              <Typography>Allergies: {medical.allergies}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Parent Dashboard
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && students.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No students found. Please contact the school administration if you believe this is an error.
          </Alert>
        )}

        {!loading && !error && students.length > 0 && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Grades" />
                <Tab label="Medical Information" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 2 }}>
              {selectedTab === 0 && (
                <Grid container spacing={2}>
                  {students.map((student) => (
                    <Grid item xs={12} key={student.id}>
                      {renderGrades(student)}
                    </Grid>
                  ))}
                </Grid>
              )}

              {selectedTab === 1 && (
                <Grid container spacing={2}>
                  {students.map((student) => (
                    <Grid item xs={12} key={student.id}>
                      {renderMedical(student)}
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </>
        )}
      </Paper>

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
            onSuccess={async () => {
              setOpenMedicalForm(false);
              await refreshData();
            }}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default ParentDashboard;
