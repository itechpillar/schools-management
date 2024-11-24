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
  Snackbar,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../services/api';
import AuthService from '../services/auth.service';
import { AxiosError } from 'axios';

interface StudentFormProps {
  open: boolean;
  handleClose: () => void;
  onComplete: (data: any) => void;
  editingStudent: any;
  schools: any[];
}

interface BasicInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  schoolId: string | null;
  status: 'active' | 'inactive';
}

interface AcademicInfo {
  academicYear: string;
  grade: string;
  section: string;
  rollNumber: string;
  previousSchool: string;
  admissionDate: string;
  board: string;
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

interface EmergencyContacts {
  contact_name: string;
  relationship: string;
  phone_number: string;
  email: string;
  home_address: string;
  alternate_contact_name: string;
  alternate_contact_relationship: string;
  alternate_contact_number: string;
  communication_preference: string;
}

interface FeeStructure {
  feeType: string;
  academicYear: string;
  term: string;
  amount: string;
  amountPaid: string;
  balance: string;
  dueDate: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  receiptNumber: string;
  remarks: string;
  paymentDate: string;
  collectedBy: string;
  isCancelled: boolean;
  cancellationReason: string;
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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [studentId, setStudentId] = useState<string | null>(null);
  const currentUser = AuthService.getCurrentUser();
  const isSchoolAdmin = currentUser?.roles.includes('school_admin');
  const userSchoolId = currentUser?.schoolId || null;

  // Form data states for each step
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    grade: '',
    schoolId: isSchoolAdmin && userSchoolId ? userSchoolId : null,
    status: 'active'
  });

  useEffect(() => {
    // Set school ID for school admin when component mounts or when currentUser changes
    if (isSchoolAdmin && userSchoolId && !basicInfo.schoolId) {
      setBasicInfo(prev => ({
        ...prev,
        schoolId: userSchoolId
      }));
    }
  }, [isSchoolAdmin, userSchoolId]);

  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    academicYear: '',
    grade: '',
    section: '',
    rollNumber: '',
    previousSchool: '',
    admissionDate: '',
    board: '',
  });

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

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContacts>({
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

  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
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
    const fetchStudentData = async () => {
      if (editingStudent && studentId) {
        try {
          const response = await api.get(`/students/${studentId}`);
          const studentData = response.data.data;
          
          setBasicInfo({
            firstName: studentData.firstName || '',
            lastName: studentData.lastName || '',
            middleName: studentData.middleName || '',
            dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toISOString().split('T')[0] : '',
            gender: studentData.gender || '',
            grade: studentData.grade || '',
            schoolId: isSchoolAdmin && userSchoolId ? userSchoolId : studentData.schoolId || null,
            status: studentData.status || 'active'
          });
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      }
    };

    fetchStudentData();
  }, [editingStudent, studentId, isSchoolAdmin, userSchoolId]);

  useEffect(() => {
    if (!editingStudent?.id || !open) return;

    const loadStepData = async () => {
      try {
        switch (activeStep) {
          case 1: // Academic Information
            const academicResponse = await api.get(`/students/${editingStudent.id}/academics`);
            if (academicResponse.data?.data?.[0]) {
              const academicData = academicResponse.data.data[0];
              setAcademicInfo({
                academicYear: academicData.academic_year || '',
                grade: academicData.grade || '',
                section: academicData.section || '',
                rollNumber: academicData.roll_number || '',
                previousSchool: academicData.previous_school || '',
                admissionDate: academicData.admission_date ? 
                  new Date(academicData.admission_date).toISOString().split('T')[0] : '',
                board: academicData.board || ''
              });
            }
            break;

          case 2: // Medical Information
            const medicalResponse = await api.get(`/students/${editingStudent.id}/medicals`);
            if (medicalResponse.data?.data?.[0]) {
              const medicalData = medicalResponse.data.data[0];
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
            break;

          case 3: // Emergency Contacts
            const contactsResponse = await api.get(`/students/${editingStudent.id}/emergency-contacts`);
            if (contactsResponse.data?.data?.[0]) {
              const contactData = contactsResponse.data.data[0];
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
            break;

          case 4: // Fee Structure
            const feeResponse = await api.get(`/students/${editingStudent.id}/fees`);
            if (feeResponse.data?.data?.[0]) {
              const feeData = feeResponse.data.data[0];
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
            break;
        }
      } catch (error) {
        console.error(`Error loading data for step ${activeStep}:`, error);
      }
    };

    loadStepData();
  }, [editingStudent?.id, activeStep, open]);

  const handleInputChange = (section: string, field: string, value: any) => {
    switch (section) {
      case 'basic':
        setBasicInfo((prev: BasicInfo) => ({ ...prev, [field]: value }));
        break;
      case 'academic':
        setAcademicInfo((prev: AcademicInfo) => ({ ...prev, [field]: value }));
        break;
      case 'medical':
        setMedicalInfo((prev: MedicalInfo) => ({ ...prev, [field]: value }));
        break;
      case 'emergency':
        setEmergencyContacts((prev: EmergencyContacts) => ({ ...prev, [field]: value }));
        break;
      case 'fee':
        setFeeStructure((prev: FeeStructure) => ({ ...prev, [field]: value }));
        break;
    }
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!basicInfo.firstName || !basicInfo.lastName || !basicInfo.dateOfBirth || 
            !basicInfo.gender || !basicInfo.grade || !basicInfo.schoolId) {
          setError('Please fill in all required fields');
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
      grade: '',
      schoolId: isSchoolAdmin && userSchoolId ? userSchoolId : null,
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const studentData = {
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        middleName: basicInfo.middleName,
        dateOfBirth: basicInfo.dateOfBirth,
        gender: basicInfo.gender,
        grade: basicInfo.grade,
        schoolId: basicInfo.schoolId || '',
        status: basicInfo.status,
      };

      let response;
      if (editingStudent) {
        response = await api.put(`/students/${studentId}`, studentData);
      } else {
        response = await api.post('/students', studentData);
        setStudentId(response.data.data.id);
      }

      if (onComplete) {
        onComplete(response.data);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 403) {
        setError('You do not have permission to perform this action. Please check your role and assigned school.');
      } else {
        setError(error.response?.data?.message || 'An error occurred while saving data');
      }
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

  const renderBasicInfoStep = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="First Name"
          value={basicInfo.firstName}
          onChange={(e) => handleInputChange('basic', 'firstName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Middle Name"
          value={basicInfo.middleName}
          onChange={(e) => handleInputChange('basic', 'middleName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Last Name"
          value={basicInfo.lastName}
          onChange={(e) => handleInputChange('basic', 'lastName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="date"
          label="Date of Birth"
          value={basicInfo.dateOfBirth}
          onChange={(e) => handleInputChange('basic', 'dateOfBirth', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={basicInfo.gender}
            onChange={(e) => handleInputChange('basic', 'gender', e.target.value)}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {!isSchoolAdmin && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>School</InputLabel>
            <Select
              value={basicInfo.schoolId}
              onChange={(e) => handleInputChange('basic', 'schoolId', e.target.value)}
              label="School"
            >
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {isSchoolAdmin && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>School</InputLabel>
            <Select
              value={basicInfo.schoolId}
              label="School"
              disabled
            >
              {schools.filter(school => school.id === userSchoolId).map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Grade</InputLabel>
          <Select
            value={basicInfo.grade}
            onChange={(e) => handleInputChange('basic', 'grade', e.target.value)}
            label="Grade"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
              <MenuItem key={grade} value={grade.toString()}>
                Grade {grade}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={basicInfo.status}
            onChange={(e) => handleInputChange('basic', 'status', e.target.value)}
            label="Status"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderAcademicInfoStep = () => (
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

  const renderMedicalInfoStep = () => (
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

  const renderEmergencyContactsStep = () => (
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

  const renderFeeStructureStep = () => (
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderBasicInfoStep();
      case 1:
        return renderAcademicInfoStep();
      case 2:
        return renderMedicalInfoStep();
      case 3:
        return renderEmergencyContactsStep();
      case 4:
        return renderFeeStructureStep();
      default:
        return null;
    }
  };

  const closeForm = () => {
    resetForm();
    handleClose();
  };

  const handleNext = async () => {
    try {
      // If we're on the last step and moving forward, don't submit again
      if (activeStep === steps.length - 1) {
        handleClose();
        return;
      }

      // Validate current step
      if (!validateStep()) {
        return;
      }

      // Handle step-specific submissions
      switch (activeStep) {
        case 0:
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

          console.log('Submitting student data:', studentData);
          
          try {
            let response;
            if (editingStudent) {
              response = await api.put(`/students/${studentId}`, studentData);
            } else {
              response = await api.post('/students', studentData);
              setStudentId(response.data.data.id);
            }
            
            console.log('API Response:', response.data);
            
            if (!response.data.data) {
              throw new Error('No data received from the server');
            }
          } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            console.error('API Error:', axiosError.response?.data || axiosError.message);
            if (axiosError.response?.status === 403) {
              setError('You do not have permission to perform this action. Please check your role and assigned school.');
            } else {
              setError(axiosError.response?.data?.message || 'Error creating student. Please try again.');
            }
            setLoading(false);
            return;
          }
          break;
        case 1:
          if (editingStudent) {
            // First get the existing academic record
            const academicResponse = await api.get(`/students/${studentId}/academics`);
            const academicId = academicResponse.data?.data?.[0]?.id;

            if (academicId) {
              // Update existing academic record
              await api.put(`/students/${studentId}/academics/${academicId}`, {
                academic_year: academicInfo.academicYear,
                grade: academicInfo.grade,
                section: academicInfo.section,
                roll_number: academicInfo.rollNumber,
                previous_school: academicInfo.previousSchool,
                admission_date: academicInfo.admissionDate ? new Date(academicInfo.admissionDate).toISOString().split('T')[0] : null,
                board: academicInfo.board
              });
            } else {
              // Create new academic record if none exists
              await api.post(`/students/${studentId}/academics`, {
                academic_year: academicInfo.academicYear,
                grade: academicInfo.grade,
                section: academicInfo.section,
                roll_number: academicInfo.rollNumber,
                previous_school: academicInfo.previousSchool,
                admission_date: academicInfo.admissionDate ? new Date(academicInfo.admissionDate).toISOString().split('T')[0] : null,
                board: academicInfo.board
              });
            }
          } else {
            // Create new academic record for new student
            await api.post(`/students/${studentId}/academics`, {
              academic_year: academicInfo.academicYear,
              grade: academicInfo.grade,
              section: academicInfo.section,
              roll_number: academicInfo.rollNumber,
              previous_school: academicInfo.previousSchool,
              admission_date: academicInfo.admissionDate ? new Date(academicInfo.admissionDate).toISOString().split('T')[0] : null,
              board: academicInfo.board
            });
          }
          break;

        case 2:
          if (editingStudent) {
            // First get the existing medical record
            const medicalResponse = await api.get(`/students/${studentId}/medicals`);
            const medicalId = medicalResponse.data?.data?.[0]?.id;

            if (medicalId) {
              // Update existing medical record
              await api.put(`/students/${studentId}/medicals/${medicalId}`, {
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
              // Create new medical record if none exists
              await api.post(`/students/${studentId}/medicals`, {
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
          } else {
            // Create new medical record for new student
            await api.post(`/students/${studentId}/medicals`, {
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
            // First get the existing emergency contact record
            const contactsResponse = await api.get(`/students/${studentId}/emergency-contacts`);
            const contactId = contactsResponse.data?.data?.[0]?.id;

            if (contactId) {
              // Update existing emergency contact
              await api.put(`/students/${studentId}/emergency-contacts/${contactId}`, {
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
              // Create new emergency contact if none exists
              await api.post(`/students/${studentId}/emergency-contacts`, {
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
          } else {
            // Create new emergency contact for new student
            await api.post(`/students/${studentId}/emergency-contacts`, {
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
            // First get the existing fee record
            const feesResponse = await api.get(`/students/${studentId}/fees`);
            const feeId = feesResponse.data?.data?.[0]?.id;

            if (feeId) {
              // Update existing fee record
              await api.put(`/students/${studentId}/fees/${feeId}`, {
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
              // Create new fee record if none exists
              await api.post(`/students/${studentId}/fees`, {
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
          } else {
            // Create new fee record for new student
            await api.post(`/students/${studentId}/fees`, {
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

      // Move to next step
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } catch (error: any) {
      console.error('Error in handleNext:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error saving data: ' + (error?.response?.data?.message || error?.message || 'Unknown error'), 
        severity: 'error' 
      });
    }
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
            {renderStepContent()}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button
          color="inherit"
          onClick={closeForm}
        >
          Cancel
        </Button>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleNext}
            color="primary"
            variant="contained"
          >
            Finish
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            color="primary"
            variant="contained"
          >
            Next
          </Button>
        )}
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default StudentForm;
