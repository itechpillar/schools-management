import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../services/api';

interface StudentFormProps {
  open: boolean;
  handleClose: () => void;
  onComplete: (data: any) => void;
  editingStudent: any;
  schools: any[];
}

const steps = [
  'Basic Information',
  'Academic Information',
  'Medical Information',
  'Emergency Contacts',
  'Fee Structure'
];

const StudentForm: React.FC<StudentFormProps> = ({
  open,
  handleClose,
  onComplete,
  editingStudent,
  schools,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  
  // Form data states for each step
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    schoolId: '',
    grade: '',
    status: 'active',
  });

  const [academicInfo, setAcademicInfo] = useState({
    academicYear: '',
    grade: '',
    section: '',
    rollNumber: '',
    previousSchool: '',
    admissionDate: '',
    board: '',
  });

  const [medicalInfo, setMedicalInfo] = useState({
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

  const [emergencyContacts, setEmergencyContacts] = useState({
    contact_name: '',
    relationship: '',
    phone_number: '',
    email: '',
    home_address: '',
    alternate_contact_name: '',
    alternate_contact_relationship: '',
    alternate_contact_number: '',
    communication_preference: ''
  });

  const [feeStructure, setFeeStructure] = useState({
    feeType: 'tuition',
    academicYear: '',
    term: '',
    amount: '',
    amountPaid: '',
    balance: '',
    dueDate: '',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    transactionId: '',
    receiptNumber: '',
    remarks: '',
    paymentDate: '',
    collectedBy: '',
    isCancelled: false,
    cancellationReason: ''
  });

  useEffect(() => {
    if (editingStudent) {
      setStudentId(editingStudent.id);
      setBasicInfo({
        firstName: editingStudent.firstName || '',
        middleName: editingStudent.middleName || '',
        lastName: editingStudent.lastName || '',
        dateOfBirth: editingStudent.dateOfBirth || '',
        gender: editingStudent.gender || '',
        schoolId: editingStudent.schoolId || '',
        grade: editingStudent.grade || '',
        status: editingStudent.status || 'active',
      });

      // Load academic information if editing
      const loadAcademicInfo = async () => {
        try {
          const response = await api.get(`/students/${editingStudent.id}/academics`);
          if (response.data && response.data.data && response.data.data.length > 0) {
            // Get the most recent academic record
            const academicData = response.data.data[0]; // Since backend orders by academic_year DESC
            setAcademicInfo({
              academicYear: academicData.academic_year || '',
              grade: academicData.grade || '',
              section: academicData.section || '',
              rollNumber: academicData.roll_number || '',
              previousSchool: academicData.previous_school || '',
              // Format the date to YYYY-MM-DD for the date input
              admissionDate: academicData.admission_date ? new Date(academicData.admission_date).toISOString().split('T')[0] : '',
              board: academicData.board || ''
            });
          }
        } catch (error) {
          console.error('Error loading academic information:', error);
        }
      };

      // Load medical information if editing
      const loadMedicalInfo = async () => {
        try {
          const response = await api.get(`/students/${editingStudent.id}/medicals`);
          if (response.data && response.data.data && response.data.data.length > 0) {
            // Get the most recent medical record
            const medicalData = response.data.data[0]; // Since backend orders by created date
            setMedicalInfo({
              blood_group: medicalData.blood_group || '',
              medical_conditions: medicalData.medical_conditions || '',
              allergies: medicalData.allergies || '',
              medications: medicalData.medications || '',
              immunizations: medicalData.immunizations || '',
              emergency_contact_name: medicalData.emergency_contact_name || '',
              emergency_contact_number: medicalData.emergency_contact_number || '',
              family_doctor_name: medicalData.family_doctor_name || '',
              family_doctor_number: medicalData.family_doctor_number || '',
              preferred_hospital: medicalData.preferred_hospital || '',
              medical_insurance: medicalData.medical_insurance || '',
              special_needs: medicalData.special_needs || '',
              dietary_restrictions: medicalData.dietary_restrictions || '',
              physical_disabilities: medicalData.physical_disabilities || '',
              last_physical_exam: medicalData.last_physical_exam || '',
              additional_notes: medicalData.additional_notes || ''
            });
          }
        } catch (error) {
          console.error('Error loading medical information:', error);
        }
      };

      // Load emergency contacts if editing
      const loadEmergencyContacts = async () => {
        try {
          const response = await api.get(`/students/${editingStudent.id}/emergency-contacts`);
          if (response.data && response.data.data && response.data.data.length > 0) {
            // Get the primary emergency contact
            const contactData = response.data.data[0];
            setEmergencyContacts({
              contact_name: contactData.contact_name || '',
              relationship: contactData.relationship || '',
              phone_number: contactData.phone_number || '',
              email: contactData.email || '',
              home_address: contactData.home_address || '',
              alternate_contact_name: contactData.alternate_contact_name || '',
              alternate_contact_relationship: contactData.alternate_contact_relationship || '',
              alternate_contact_number: contactData.alternate_contact_number || '',
              communication_preference: contactData.communication_preference || ''
            });
          }
        } catch (error) {
          console.error('Error loading emergency contacts:', error);
        }
      };

      // Load fee information if editing
      const loadFeeInfo = async () => {
        console.log('Loading fee information for student:', editingStudent.id);
        try {
          const response = await api.get(`/students/${editingStudent.id}/fees`);
          if (response.data && response.data.data && response.data.data.length > 0) {
            // Get the most recent fee record
            const feeData = response.data.data[0];
            setFeeStructure({
              feeType: feeData.fee_type || 'tuition',
              academicYear: feeData.academic_year || '',
              term: feeData.term || '',
              amount: feeData.amount?.toString() || '',
              amountPaid: feeData.amount_paid?.toString() || '',
              balance: feeData.balance?.toString() || '',
              dueDate: feeData.due_date || '',
              paymentStatus: feeData.payment_status || 'pending',
              paymentMethod: feeData.payment_method || 'cash',
              transactionId: feeData.transaction_id || '',
              receiptNumber: feeData.receipt_number || '',
              remarks: feeData.remarks || '',
              paymentDate: feeData.payment_date || '',
              collectedBy: feeData.collected_by || '',
              isCancelled: feeData.is_cancelled || false,
              cancellationReason: feeData.cancellation_reason || ''
            });
          }
        } catch (error) {
          console.error('Error loading fee information:', error);
        }
      };

      // Load all additional information
      loadAcademicInfo();
      loadMedicalInfo();
      loadEmergencyContacts();
      loadFeeInfo();
    }
  }, [editingStudent]);

  const handleInputChange = (section: string, field: string, value: any) => {
    switch (section) {
      case 'basic':
        setBasicInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'academic':
        setAcademicInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'medical':
        setMedicalInfo(prev => ({ ...prev, [field]: value }));
        break;
      case 'emergency':
        setEmergencyContacts(prev => ({ ...prev, [field]: value }));
        break;
      case 'fee':
        setFeeStructure(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        const missingBasicFields = [];
        if (!basicInfo.firstName?.trim()) missingBasicFields.push('First Name');
        if (!basicInfo.lastName?.trim()) missingBasicFields.push('Last Name');
        if (!basicInfo.dateOfBirth) missingBasicFields.push('Date of Birth');
        if (!basicInfo.gender) missingBasicFields.push('Gender');
        if (!basicInfo.schoolId) missingBasicFields.push('School');
        if (!basicInfo.grade?.trim()) missingBasicFields.push('Grade');

        if (missingBasicFields.length > 0) {
          setError(`Please fill in the following required fields: ${missingBasicFields.join(', ')}`);
          return false;
        }
        break;
      case 1:
        const missingAcademicFields = [];
        if (!academicInfo.academicYear?.trim()) missingAcademicFields.push('Academic Year');
        if (!academicInfo.grade?.trim()) missingAcademicFields.push('Grade');
        if (!academicInfo.section?.trim()) missingAcademicFields.push('Section');
        if (!academicInfo.rollNumber?.trim()) missingAcademicFields.push('Roll Number');

        if (missingAcademicFields.length > 0) {
          setError(`Please fill in the following required fields: ${missingAcademicFields.join(', ')}`);
          return false;
        }
        break;
      case 3:
        const missingEmergencyFields = [];
        if (!emergencyContacts.contact_name?.trim()) missingEmergencyFields.push('Contact Name');
        if (!emergencyContacts.relationship?.trim()) missingEmergencyFields.push('Relationship');
        if (!emergencyContacts.phone_number?.trim()) missingEmergencyFields.push('Phone Number');
        if (!emergencyContacts.home_address?.trim()) missingEmergencyFields.push('Home Address');

        if (missingEmergencyFields.length > 0) {
          setError(`Please fill in the following required fields: ${missingEmergencyFields.join(', ')}`);
          return false;
        }
        break;
    }
    return true;
  };

  const resetForm = () => {
    setActiveStep(0);
    setError('');
    setStudentId(null);
    setBasicInfo({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      schoolId: '',
      grade: '',
      status: 'active',
    });
    setAcademicInfo({
      academicYear: '',
      grade: '',
      section: '',
      rollNumber: '',
      previousSchool: '',
      admissionDate: '',
      board: '',
    });
    setMedicalInfo({
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
    setEmergencyContacts({
      contact_name: '',
      relationship: '',
      phone_number: '',
      email: '',
      home_address: '',
      alternate_contact_name: '',
      alternate_contact_relationship: '',
      alternate_contact_number: '',
      communication_preference: ''
    });
    setFeeStructure({
      feeType: 'tuition',
      academicYear: '',
      term: '',
      amount: '',
      amountPaid: '',
      balance: '',
      dueDate: '',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      transactionId: '',
      receiptNumber: '',
      remarks: '',
      paymentDate: '',
      collectedBy: '',
      isCancelled: false,
      cancellationReason: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let studentIdToUse = studentId;

      // Only create/update basic student info in the first step
      if (activeStep === 0) {
        const studentData = {
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName,
          middleName: basicInfo.middleName,
          dateOfBirth: basicInfo.dateOfBirth,
          gender: basicInfo.gender,
          grade: basicInfo.grade,
          schoolId: basicInfo.schoolId,
          status: basicInfo.status,
        };

        let response;
        if (editingStudent) {
          response = await api.put(`/students/${studentId}`, studentData);
        } else {
          response = await api.post('/students', studentData);
          studentIdToUse = response.data.data.id;
          setStudentId(studentIdToUse);
        }
      }

      // For subsequent steps, use the existing studentId
      if (!studentIdToUse) {
        throw new Error('No student ID available. Please complete the basic information first.');
      }

      // Handle step-specific submissions
      switch (activeStep) {
        case 1:
          if (editingStudent) {
            await api.put(`/students/${studentIdToUse}/academics`, {
              academic_year: academicInfo.academicYear,
              grade: academicInfo.grade,
              section: academicInfo.section,
              roll_number: academicInfo.rollNumber,
              previous_school: academicInfo.previousSchool,
              // Send date in ISO format without time
              admission_date: academicInfo.admissionDate ? new Date(academicInfo.admissionDate).toISOString().split('T')[0] : null,
              board: academicInfo.board
            });
          } else {
            await api.post(`/students/${studentIdToUse}/academics`, {
              academic_year: academicInfo.academicYear,
              grade: academicInfo.grade,
              section: academicInfo.section,
              roll_number: academicInfo.rollNumber,
              previous_school: academicInfo.previousSchool,
              // Send date in ISO format without time
              admission_date: academicInfo.admissionDate ? new Date(academicInfo.admissionDate).toISOString().split('T')[0] : null,
              board: academicInfo.board
            });
          }
          break;

        case 2:
          if (editingStudent) {
            await api.put(`/students/${studentIdToUse}/medicals`, {
              blood_group: medicalInfo.blood_group,
              medical_conditions: medicalInfo.medical_conditions,
              allergies: medicalInfo.allergies,
              medications: medicalInfo.medications,
              immunizations: medicalInfo.immunizations,
              emergency_contact_name: medicalInfo.emergency_contact_name,
              emergency_contact_number: medicalInfo.emergency_contact_number,
              family_doctor_name: medicalInfo.family_doctor_name,
              family_doctor_number: medicalInfo.family_doctor_number,
              preferred_hospital: medicalInfo.preferred_hospital,
              medical_insurance: medicalInfo.medical_insurance,
              special_needs: medicalInfo.special_needs,
              dietary_restrictions: medicalInfo.dietary_restrictions,
              physical_disabilities: medicalInfo.physical_disabilities,
              last_physical_exam: medicalInfo.last_physical_exam,
              additional_notes: medicalInfo.additional_notes
            });
          } else {
            await api.post(`/students/${studentIdToUse}/medicals`, {
              blood_group: medicalInfo.blood_group,
              medical_conditions: medicalInfo.medical_conditions,
              allergies: medicalInfo.allergies,
              medications: medicalInfo.medications,
              immunizations: medicalInfo.immunizations,
              emergency_contact_name: medicalInfo.emergency_contact_name,
              emergency_contact_number: medicalInfo.emergency_contact_number,
              family_doctor_name: medicalInfo.family_doctor_name,
              family_doctor_number: medicalInfo.family_doctor_number,
              preferred_hospital: medicalInfo.preferred_hospital,
              medical_insurance: medicalInfo.medical_insurance,
              special_needs: medicalInfo.special_needs,
              dietary_restrictions: medicalInfo.dietary_restrictions,
              physical_disabilities: medicalInfo.physical_disabilities,
              last_physical_exam: medicalInfo.last_physical_exam,
              additional_notes: medicalInfo.additional_notes
            });
          }
          break;

        case 3:
          if (editingStudent) {
            await api.put(`/students/${studentIdToUse}/emergency-contacts`, {
              contact_name: emergencyContacts.contact_name,
              relationship: emergencyContacts.relationship,
              phone_number: emergencyContacts.phone_number,
              email: emergencyContacts.email,
              home_address: emergencyContacts.home_address,
              alternate_contact_name: emergencyContacts.alternate_contact_name,
              alternate_contact_relationship: emergencyContacts.alternate_contact_relationship,
              alternate_contact_number: emergencyContacts.alternate_contact_number,
              communication_preference: emergencyContacts.communication_preference
            });
          } else {
            await api.post(`/students/${studentIdToUse}/emergency-contacts`, {
              contact_name: emergencyContacts.contact_name,
              relationship: emergencyContacts.relationship,
              phone_number: emergencyContacts.phone_number,
              email: emergencyContacts.email,
              home_address: emergencyContacts.home_address,
              alternate_contact_name: emergencyContacts.alternate_contact_name,
              alternate_contact_relationship: emergencyContacts.alternate_contact_relationship,
              alternate_contact_number: emergencyContacts.alternate_contact_number,
              communication_preference: emergencyContacts.communication_preference
            });
          }
          break;

        case 4:
          if (editingStudent) {
            await api.put(`/students/${studentIdToUse}/fees`, {
              fee_type: feeStructure.feeType,
              academic_year: feeStructure.academicYear,
              term: feeStructure.term,
              amount: parseFloat(feeStructure.amount) || 0,
              amount_paid: parseFloat(feeStructure.amountPaid) || 0,
              balance: parseFloat(feeStructure.balance) || 0,
              due_date: feeStructure.dueDate,
              payment_status: feeStructure.paymentStatus,
              payment_method: feeStructure.paymentMethod,
              transaction_id: feeStructure.transactionId,
              receipt_number: feeStructure.receiptNumber,
              remarks: feeStructure.remarks,
              payment_date: feeStructure.paymentDate,
              collected_by: feeStructure.collectedBy,
              is_cancelled: feeStructure.isCancelled,
              cancellation_reason: feeStructure.cancellationReason
            });
          } else {
            await api.post(`/students/${studentIdToUse}/fees`, {
              fee_type: feeStructure.feeType,
              academic_year: feeStructure.academicYear,
              term: feeStructure.term,
              amount: parseFloat(feeStructure.amount) || 0,
              amount_paid: parseFloat(feeStructure.amountPaid) || 0,
              balance: parseFloat(feeStructure.balance) || 0,
              due_date: feeStructure.dueDate,
              payment_status: feeStructure.paymentStatus,
              payment_method: feeStructure.paymentMethod,
              transaction_id: feeStructure.transactionId,
              receipt_number: feeStructure.receiptNumber,
              remarks: feeStructure.remarks,
              payment_date: feeStructure.paymentDate,
              collected_by: feeStructure.collectedBy,
              is_cancelled: feeStructure.isCancelled,
              cancellation_reason: feeStructure.cancellationReason
            });
          }
          break;
      }

      setLoading(false);
      if (activeStep === steps.length - 1) {
        // Just refresh the student list without creating a new record
        if (typeof onComplete === 'function') {
          onComplete(studentIdToUse);
        }
        resetForm();
        handleClose();
      } else {
        setActiveStep(prev => prev + 1);
      }
    } catch (error) {
      setLoading(false);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'An error occurred while saving data');
      } else {
        setError('An error occurred while saving data');
      }
      console.error('Error:', error);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const getEndpointForStep = (step: number) => {
    switch (step) {
      case 0:
        return 'basic';
      case 1:
        return 'academic';
      case 2:
        return 'medicals';
      case 3:
        return 'emergency-contacts';
      case 4:
        return 'fees';
      default:
        return '';
    }
  };

  const getDataForStep = (step: number): any => {
    console.log('Getting data for step:', step);
    const data: Record<number, any> = {
      0: basicInfo,
      1: academicInfo,
      2: medicalInfo,
      3: emergencyContacts,
      4: feeStructure
    };
    console.log('Step data:', data[step]);
    return data[step] || {};
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="First Name"
                value={basicInfo.firstName}
                onChange={(e) => handleInputChange('basic', 'firstName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Middle Name"
                value={basicInfo.middleName}
                onChange={(e) => handleInputChange('basic', 'middleName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last Name"
                value={basicInfo.lastName}
                onChange={(e) => handleInputChange('basic', 'lastName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={basicInfo.dateOfBirth}
                onChange={(e) => handleInputChange('basic', 'dateOfBirth', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={basicInfo.gender}
                  onChange={(e) => handleInputChange('basic', 'gender', e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>School</InputLabel>
                <Select
                  value={basicInfo.schoolId}
                  onChange={(e) => handleInputChange('basic', 'schoolId', e.target.value)}
                >
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Grade"
                value={basicInfo.grade}
                onChange={(e) => handleInputChange('basic', 'grade', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={academicInfo.academicYear}
                onChange={(e) => handleInputChange('academic', 'academicYear', e.target.value)}
                required
                helperText="e.g., 2023-2024"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Grade</InputLabel>
                <Select
                  value={academicInfo.grade || ''}
                  onChange={(e) => handleInputChange('academic', 'grade', e.target.value)}
                  label="Grade"
                >
                  <MenuItem value="">Select Grade</MenuItem>
                  <MenuItem value="1">Grade 1</MenuItem>
                  <MenuItem value="2">Grade 2</MenuItem>
                  <MenuItem value="3">Grade 3</MenuItem>
                  <MenuItem value="4">Grade 4</MenuItem>
                  <MenuItem value="5">Grade 5</MenuItem>
                  <MenuItem value="6">Grade 6</MenuItem>
                  <MenuItem value="7">Grade 7</MenuItem>
                  <MenuItem value="8">Grade 8</MenuItem>
                  <MenuItem value="9">Grade 9</MenuItem>
                  <MenuItem value="10">Grade 10</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Section</InputLabel>
                <Select
                  value={academicInfo.section || ''}
                  onChange={(e) => handleInputChange('academic', 'section', e.target.value)}
                  label="Section"
                >
                  <MenuItem value="">Select Section</MenuItem>
                  <MenuItem value="A">Section A</MenuItem>
                  <MenuItem value="B">Section B</MenuItem>
                  <MenuItem value="C">Section C</MenuItem>
                  <MenuItem value="D">Section D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                value={academicInfo.rollNumber}
                onChange={(e) => handleInputChange('academic', 'rollNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Previous School"
                value={academicInfo.previousSchool}
                onChange={(e) => handleInputChange('academic', 'previousSchool', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Date"
                type="date"
                value={academicInfo.admissionDate}
                onChange={(e) => handleInputChange('academic', 'admissionDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Board"
                value={academicInfo.board}
                onChange={(e) => handleInputChange('academic', 'board', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Group"
                value={medicalInfo.blood_group || ''}
                onChange={(e) => handleInputChange('medical', 'blood_group', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Medical Conditions"
                value={medicalInfo.medical_conditions || ''}
                onChange={(e) => handleInputChange('medical', 'medical_conditions', e.target.value)}
                helperText="Enter medical conditions, separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Allergies"
                value={medicalInfo.allergies || ''}
                onChange={(e) => handleInputChange('medical', 'allergies', e.target.value)}
                helperText="Enter allergies, separated by commas"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Medications"
                value={medicalInfo.medications || ''}
                onChange={(e) => handleInputChange('medical', 'medications', e.target.value)}
                helperText="Enter current medications and dosage"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Immunizations"
                value={medicalInfo.immunizations || ''}
                onChange={(e) => handleInputChange('medical', 'immunizations', e.target.value)}
                helperText="Enter immunization history"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                value={medicalInfo.emergency_contact_name || ''}
                onChange={(e) => handleInputChange('medical', 'emergency_contact_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Number"
                value={medicalInfo.emergency_contact_number || ''}
                onChange={(e) => handleInputChange('medical', 'emergency_contact_number', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Family Doctor Name"
                value={medicalInfo.family_doctor_name || ''}
                onChange={(e) => handleInputChange('medical', 'family_doctor_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Family Doctor Number"
                value={medicalInfo.family_doctor_number || ''}
                onChange={(e) => handleInputChange('medical', 'family_doctor_number', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Hospital"
                value={medicalInfo.preferred_hospital || ''}
                onChange={(e) => handleInputChange('medical', 'preferred_hospital', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Medical Insurance"
                value={medicalInfo.medical_insurance || ''}
                onChange={(e) => handleInputChange('medical', 'medical_insurance', e.target.value)}
                helperText="Enter insurance provider and policy details"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Special Needs"
                value={medicalInfo.special_needs || ''}
                onChange={(e) => handleInputChange('medical', 'special_needs', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Dietary Restrictions"
                value={medicalInfo.dietary_restrictions || ''}
                onChange={(e) => handleInputChange('medical', 'dietary_restrictions', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Physical Disabilities"
                value={medicalInfo.physical_disabilities || ''}
                onChange={(e) => handleInputChange('medical', 'physical_disabilities', e.target.value)}
                helperText="Enter physical disabilities and required accommodations"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Last Physical Exam"
                value={medicalInfo.last_physical_exam || ''}
                onChange={(e) => handleInputChange('medical', 'last_physical_exam', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes"
                value={medicalInfo.additional_notes || ''}
                onChange={(e) => handleInputChange('medical', 'additional_notes', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                value={emergencyContacts.contact_name}
                onChange={(e) => handleInputChange('emergency', 'contact_name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Relationship"
                value={emergencyContacts.relationship}
                onChange={(e) => handleInputChange('emergency', 'relationship', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={emergencyContacts.phone_number}
                onChange={(e) => handleInputChange('emergency', 'phone_number', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={emergencyContacts.email}
                onChange={(e) => handleInputChange('emergency', 'email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Home Address"
                value={emergencyContacts.home_address}
                onChange={(e) => handleInputChange('emergency', 'home_address', e.target.value)}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alternate Contact Name"
                value={emergencyContacts.alternate_contact_name}
                onChange={(e) => handleInputChange('emergency', 'alternate_contact_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alternate Contact Relationship"
                value={emergencyContacts.alternate_contact_relationship}
                onChange={(e) => handleInputChange('emergency', 'alternate_contact_relationship', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alternate Contact Number"
                value={emergencyContacts.alternate_contact_number}
                onChange={(e) => handleInputChange('emergency', 'alternate_contact_number', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Communication Preference"
                value={emergencyContacts.communication_preference}
                onChange={(e) => handleInputChange('emergency', 'communication_preference', e.target.value)}
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fee Type</InputLabel>
                <Select
                  value={feeStructure.feeType}
                  onChange={(e) => handleInputChange('fee', 'feeType', e.target.value)}
                  label="Fee Type"
                >
                  <MenuItem value="tuition">Tuition</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                  <MenuItem value="transport">Transport</MenuItem>
                  <MenuItem value="library">Library</MenuItem>
                  <MenuItem value="laboratory">Laboratory</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="miscellaneous">Miscellaneous</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                value={feeStructure.academicYear}
                onChange={(e) => handleInputChange('fee', 'academicYear', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Term"
                value={feeStructure.term}
                onChange={(e) => handleInputChange('fee', 'term', e.target.value)}
                helperText="Optional: e.g., First Term, Second Term, etc."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                value={feeStructure.amount}
                onChange={(e) => handleInputChange('fee', 'amount', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount Paid"
                value={feeStructure.amountPaid}
                onChange={(e) => handleInputChange('fee', 'amountPaid', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Balance"
                value={feeStructure.balance}
                onChange={(e) => handleInputChange('fee', 'balance', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={feeStructure.dueDate}
                onChange={(e) => handleInputChange('fee', 'dueDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={feeStructure.paymentStatus}
                  onChange={(e) => handleInputChange('fee', 'paymentStatus', e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="partial">Partial</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={feeStructure.paymentMethod}
                  onChange={(e) => handleInputChange('fee', 'paymentMethod', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={feeStructure.transactionId}
                onChange={(e) => handleInputChange('fee', 'transactionId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Receipt Number"
                value={feeStructure.receiptNumber}
                onChange={(e) => handleInputChange('fee', 'receiptNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Remarks"
                value={feeStructure.remarks}
                onChange={(e) => handleInputChange('fee', 'remarks', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Payment Date"
                value={feeStructure.paymentDate}
                onChange={(e) => handleInputChange('fee', 'paymentDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Collected By"
                value={feeStructure.collectedBy}
                onChange={(e) => handleInputChange('fee', 'collectedBy', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={feeStructure.isCancelled}
                    onChange={(e) => handleInputChange('fee', 'isCancelled', e.target.checked)}
                  />
                }
                label="Is Cancelled"
              />
            </Grid>
            {feeStructure.isCancelled && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Cancellation Reason"
                  value={feeStructure.cancellationReason}
                  onChange={(e) => handleInputChange('fee', 'cancellationReason', e.target.value)}
                />
              </Grid>
            )}
          </Grid>
        );
      // Add cases for other steps...
      default:
        return null;
    }
  };

  const closeForm = () => {
    resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={closeForm} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingStudent ? 'Edit Student' : 'Add New Student'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', mt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 4, mb: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={closeForm}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Finish'}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Next'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StudentForm;
