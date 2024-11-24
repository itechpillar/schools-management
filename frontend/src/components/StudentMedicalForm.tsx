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
  medications: string;
  immunizations: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  family_doctor_name: string;
  family_doctor_number: string;
  preferred_hospital: string;
  medical_insurance: string;
  special_needs: string;
  dietary_restrictions: string;
  physical_disabilities: string;
  last_physical_exam: string;
  additional_notes: string;
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
    medications: '',
    immunizations: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    family_doctor_name: '',
    family_doctor_number: '',
    preferred_hospital: '',
    medical_insurance: '',
    special_needs: '',
    dietary_restrictions: '',
    physical_disabilities: '',
    last_physical_exam: '',
    additional_notes: '',
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical Conditions"
            multiline
            rows={2}
            value={medicalInfo.medical_conditions}
            onChange={handleChange('medical_conditions')}
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
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Medications"
            value={medicalInfo.medications}
            onChange={handleChange('medications')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Immunizations"
            value={medicalInfo.immunizations}
            onChange={handleChange('immunizations')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Emergency Contact Name"
            value={medicalInfo.emergency_contact_name}
            onChange={handleChange('emergency_contact_name')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Emergency Contact Number"
            value={medicalInfo.emergency_contact_number}
            onChange={handleChange('emergency_contact_number')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Family Doctor Name"
            value={medicalInfo.family_doctor_name}
            onChange={handleChange('family_doctor_name')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Family Doctor Number"
            value={medicalInfo.family_doctor_number}
            onChange={handleChange('family_doctor_number')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Preferred Hospital"
            value={medicalInfo.preferred_hospital}
            onChange={handleChange('preferred_hospital')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Medical Insurance"
            value={medicalInfo.medical_insurance}
            onChange={handleChange('medical_insurance')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Needs"
            value={medicalInfo.special_needs}
            onChange={handleChange('special_needs')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dietary Restrictions"
            value={medicalInfo.dietary_restrictions}
            onChange={handleChange('dietary_restrictions')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Physical Disabilities"
            value={medicalInfo.physical_disabilities}
            onChange={handleChange('physical_disabilities')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Last Physical Exam"
            value={medicalInfo.last_physical_exam}
            onChange={handleChange('last_physical_exam')}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            value={medicalInfo.additional_notes}
            onChange={handleChange('additional_notes')}
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
          {error || 'Medical information updated successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentMedicalForm;
