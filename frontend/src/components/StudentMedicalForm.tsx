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
        const response = await api.get(`/students/${studentId}/medicals`);
        if (response.data.data && response.data.data.length > 0) {
          setMedicalInfo(response.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching medical info:', error);
        setError('Failed to load medical information');
      }
    };

    fetchMedicalInfo();
  }, [studentId]);

  const handleChange = (field: keyof MedicalInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicalInfo((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/students/${studentId}/medicals`);
      const existingMedical = response.data.data?.[0];

      if (existingMedical) {
        // Update existing medical record
        await api.put(
          `/students/${studentId}/medicals/${existingMedical.id}`,
          medicalInfo
        );
      } else {
        // Create new medical record
        await api.post(`/students/${studentId}/medicals`, medicalInfo);
      }

      setSuccess(true);
      onSuccess();
    } catch (error) {
      console.error('Error saving medical info:', error);
      setError('Failed to save medical information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Update Medical Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Blood Group"
            value={medicalInfo.blood_group}
            onChange={handleChange('blood_group')}
            placeholder="e.g., A+, B-, O+"
          />
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
            placeholder="List any allergies (food, medicine, etc.)"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Emergency Contact"
            multiline
            rows={2}
            value={medicalInfo.emergency_contact}
            onChange={handleChange('emergency_contact')}
            placeholder="Name and phone number of emergency contact"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Medical information updated successfully!</Alert>
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
