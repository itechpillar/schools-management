import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import api from '../services/api';

interface StudentMedicalFormProps {
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface MedicalInfo {
  blood_group: string;
  medical_conditions: string;
  allergies: string;
  emergency_contact: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const StudentMedicalForm: React.FC<StudentMedicalFormProps> = ({
  studentId,
  onClose,
  onSuccess,
}) => {
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    blood_group: '',
    medical_conditions: '',
    allergies: '',
    emergency_contact: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMedicalInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/students/${studentId}/medicals`);
        if (response.data.data && response.data.data.length > 0) {
          const data = response.data.data[0];
          setMedicalInfo({
            blood_group: data.blood_group || '',
            medical_conditions: data.medical_conditions || '',
            allergies: data.allergies || '',
            emergency_contact: data.emergency_contact || '',
          });
        }
      } catch (error) {
        console.error('Error fetching medical info:', error);
        setError('Failed to fetch medical information');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalInfo();
  }, [studentId]);

  const handleChange = (field: keyof MedicalInfo) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicalInfo((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);

      await api.post(`/students/${studentId}/medicals`, medicalInfo);
      
      setSuccess(true);
      onSuccess();
    } catch (error) {
      console.error('Error saving medical info:', error);
      setError('Failed to save medical information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} p={3}>
      <Typography variant="h6" gutterBottom>
        Medical Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Blood Group"
            value={medicalInfo.blood_group}
            onChange={handleChange('blood_group')}
          >
            {bloodGroups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical Conditions"
            multiline
            rows={3}
            value={medicalInfo.medical_conditions}
            onChange={handleChange('medical_conditions')}
            placeholder="List any medical conditions or health concerns"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Allergies"
            multiline
            rows={2}
            value={medicalInfo.allergies}
            onChange={handleChange('allergies')}
            placeholder="List any allergies"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Emergency Contact"
            value={medicalInfo.emergency_contact}
            onChange={handleChange('emergency_contact')}
            placeholder="Name and phone number"
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Medical information saved successfully!</Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentMedicalForm;
