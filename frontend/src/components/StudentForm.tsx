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
  schoolId: string; // Changed type to string
  status: 'active' | 'inactive';
  parentEmail: string; // Add parent email field
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

  // Initialize basicInfo state with default values
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: new Date().toISOString().split('T')[0],
    gender: '',
    grade: '',
    schoolId: isSchoolAdmin && userSchoolId ? userSchoolId : '',  // Handle null case
    status: 'active',
    parentEmail: '',
  });

  useEffect(() => {
    // Set school ID when component mounts or when user changes
    if (isSchoolAdmin && userSchoolId) {
      setBasicInfo(prev => ({
        ...prev,
        schoolId: userSchoolId || ''  // Handle null case
      }));
    }
  }, [isSchoolAdmin, userSchoolId]);

  // Update form data when editing student
  useEffect(() => {
    if (editingStudent) {
      const {
        firstName,
        lastName,
        middleName,
        dateOfBirth,
        gender,
        grade,
        schoolId,
        status,
        parentEmail,
      } = editingStudent;

      setBasicInfo({
        firstName: firstName || '',
        lastName: lastName || '',
        middleName: middleName || '',
        dateOfBirth: dateOfBirth || new Date().toISOString().split('T')[0],
        gender: gender || '',
        grade: grade || '',
        schoolId: (isSchoolAdmin && userSchoolId ? userSchoolId : schoolId) || '',  // Handle null case
        status: status || 'active',
        parentEmail: parentEmail || '',
      });
    }
  }, [editingStudent, userSchoolId, isSchoolAdmin]);

  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    grade: '1',
    section: 'A',
    rollNumber: '001',
    previousSchool: '',
    admissionDate: new Date().toISOString().split('T')[0],
    board: 'State Board',
  });

  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    blood_group: 'O+',
    medical_conditions: 'None',
    allergies: 'None',
    medications: 'None',
    immunizations: 'Up to date',
    emergency_contact_name: 'Emergency Contact',
    emergency_contact_number: '1234567890',
    family_doctor_name: 'Dr. Smith',
    family_doctor_number: '9876543210',
    preferred_hospital: 'City Hospital',
    medical_insurance: 'Yes',
    special_needs: 'None',
    dietary_restrictions: 'None',
    physical_disabilities: 'None',
    last_physical_exam: new Date().toISOString().split('T')[0],
    additional_notes: 'None',
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContacts>({
    contact_name: 'Emergency Contact',
    relationship: 'Parent',
    phone_number: '1234567890',
    email: 'emergency@example.com',
    home_address: '123 Main St',
    alternate_contact_name: 'Alternate Contact',
    alternate_contact_relationship: 'Relative',
    alternate_contact_number: '9876543210',
    communication_preference: 'Phone',
  });

  const [feeStructure, setFeeStructure] = useState<FeeStructure>({
    feeType: 'Tuition',
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    term: '1',
    amount: '10000',
    amountPaid: '0',
    balance: '10000',
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    transactionId: '',
    receiptNumber: '',
    remarks: '',
    paymentDate: '',
    collectedBy: '',
    isCancelled: false,
    cancellationReason: ''
  });

  // Set studentId when editingStudent changes
  useEffect(() => {
    if (editingStudent?.id) {
      setStudentId(editingStudent.id);
    }
  }, [editingStudent]);

  // Fetch student data when studentId changes
  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentId) {
        try {
          setLoading(true);
          setError(null);
          
          // Fetch basic info
          const response = await api.get(`/students/${studentId}`);
          const studentData = response.data.data;
          console.log('Fetched student data:', studentData);

          if (!studentData) {
            throw new Error('No student data received');
          }

          // Update basic info with proper null handling
          setBasicInfo(prevState => ({
            ...prevState,
            firstName: studentData.firstName || studentData.first_name || '',
            lastName: studentData.lastName || studentData.last_name || '',
            middleName: studentData.middleName || studentData.middle_name || '',
            dateOfBirth: studentData.dateOfBirth || studentData.date_of_birth ? 
              new Date(studentData.dateOfBirth || studentData.date_of_birth).toISOString().split('T')[0] : '',
            gender: studentData.gender || '',
            grade: studentData.grade || '',
            schoolId: (isSchoolAdmin && userSchoolId ? userSchoolId : (studentData.schoolId || studentData.school_id)) || '',
            status: studentData.status || 'active',
            parentEmail: studentData.parentEmail || studentData.parent_email || '',
          }));

          // Fetch and set academic info
          try {
            const academicResponse = await api.get(`/students/${studentId}/academics`);
            if (academicResponse?.data?.data?.[0]) {
              const academicData = academicResponse.data.data[0];
              setAcademicInfo(prevState => ({
                ...prevState,
                academicYear: academicData.academicYear || academicData.academic_year || '',
                grade: academicData.grade || '',
                section: academicData.section || '',
                rollNumber: academicData.rollNumber || academicData.roll_number || '',
                previousSchool: academicData.previousSchool || academicData.previous_school || '',
                admissionDate: academicData.admissionDate || academicData.admission_date ? 
                  new Date(academicData.admissionDate || academicData.admission_date).toISOString().split('T')[0] : '',
                board: academicData.board || ''
              }));
            } else {
              // If no academic data exists, set default empty values
              setAcademicInfo(prevState => ({
                ...prevState,
                academicYear: '',
                grade: '',
                section: '',
                rollNumber: '',
                previousSchool: '',
                admissionDate: '',
                board: ''
              }));
            }
          } catch (error: any) {
            // Handle 404 gracefully - this means no academic record exists yet
            if (error.response?.status === 404) {
              console.log('No academic record exists for this student yet');
              setAcademicInfo(prevState => ({
                ...prevState,
                academicYear: '',
                grade: '',
                section: '',
                rollNumber: '',
                previousSchool: '',
                admissionDate: '',
                board: ''
              }));
            } else {
              console.error('Error fetching academic info:', error);
            }
          }

          // Fetch and set medical info
          try {
            const medicalResponse = await api.get(`/students/${studentId}/medicals`);
            if (medicalResponse.data?.data?.[0]) {
              const medicalData = medicalResponse.data.data[0];
              setMedicalInfo(prevState => ({
                ...prevState,
                blood_group: medicalData.blood_group || medicalData.bloodGroup || '',
                medical_conditions: medicalData.medical_conditions || medicalData.medicalConditions || '',
                allergies: medicalData.allergies || '',
                medications: medicalData.medications || '',
                immunizations: medicalData.immunizations || '',
                emergency_contact_name: medicalData.emergency_contact_name || medicalData.emergencyContactName || '',
                emergency_contact_number: medicalData.emergency_contact_number || medicalData.emergencyContactNumber || '',
                family_doctor_name: medicalData.family_doctor_name || medicalData.familyDoctorName || '',
                family_doctor_number: medicalData.family_doctor_number || medicalData.familyDoctorNumber || '',
                preferred_hospital: medicalData.preferred_hospital || medicalData.preferredHospital || '',
                medical_insurance: medicalData.medical_insurance || medicalData.medicalInsurance || '',
                special_needs: medicalData.special_needs || medicalData.specialNeeds || '',
                dietary_restrictions: medicalData.dietary_restrictions || medicalData.dietaryRestrictions || '',
                physical_disabilities: medicalData.physical_disabilities || medicalData.physicalDisabilities || '',
                last_physical_exam: medicalData.last_physical_exam || medicalData.lastPhysicalExam ? 
                  new Date(medicalData.last_physical_exam || medicalData.lastPhysicalExam).toISOString().split('T')[0] : '',
                additional_notes: medicalData.additional_notes || medicalData.additionalNotes || ''
              }));
            }
          } catch (error) {
            console.error('Error fetching medical info:', error);
          }

          // Fetch and set emergency contacts
          try {
            const contactsResponse = await api.get(`/students/${studentId}/emergency-contacts`);
            if (contactsResponse.data?.data?.[0]) {
              const contactData = contactsResponse.data.data[0];
              setEmergencyContacts(prevState => ({
                ...prevState,
                contact_name: contactData.contact_name || contactData.contactName || '',
                relationship: contactData.relationship || '',
                phone_number: contactData.phone_number || contactData.phoneNumber || '',
                email: contactData.email || '',
                home_address: contactData.home_address || contactData.homeAddress || '',
                alternate_contact_name: contactData.alternate_contact_name || contactData.alternateContactName || '',
                alternate_contact_relationship: contactData.alternate_contact_relationship || contactData.alternateContactRelationship || '',
                alternate_contact_number: contactData.alternate_contact_number || contactData.alternateContactNumber || '',
                communication_preference: contactData.communication_preference || contactData.communicationPreference || ''
              }));
            }
          } catch (error) {
            console.error('Error fetching emergency contacts:', error);
          }

          // Fetch and set fee structure
          try {
            const feesResponse = await api.get(`/students/${studentId}/fees`);
            if (feesResponse.data?.data?.[0]) {
              const feeData = feesResponse.data.data[0];
              setFeeStructure(prevState => ({
                ...prevState,
                feeType: feeData.fee_type || feeData.feeType || '',
                academicYear: feeData.academic_year || feeData.academicYear || '',
                term: feeData.term || '',
                amount: (feeData.amount || '').toString(),
                amountPaid: (feeData.amount_paid || feeData.amountPaid || '').toString(),
                balance: (feeData.balance || '').toString(),
                dueDate: feeData.due_date || feeData.dueDate ? 
                  new Date(feeData.due_date || feeData.dueDate).toISOString().split('T')[0] : '',
                paymentStatus: feeData.payment_status || feeData.paymentStatus || '',
                paymentMethod: feeData.payment_method || feeData.paymentMethod || '',
                transactionId: feeData.transaction_id || feeData.transactionId || '',
                receiptNumber: feeData.receipt_number || feeData.receiptNumber || '',
                remarks: feeData.remarks || '',
                paymentDate: feeData.payment_date || feeData.paymentDate ? 
                  new Date(feeData.payment_date || feeData.paymentDate).toISOString().split('T')[0] : '',
                collectedBy: feeData.collected_by || feeData.collectedBy || '',
                isCancelled: feeData.is_cancelled || feeData.isCancelled || false,
                cancellationReason: feeData.cancellation_reason || feeData.cancellationReason || ''
              }));
            }
          } catch (error) {
            console.error('Error fetching fee structure:', error);
          }

          setLoading(false);
        } catch (error) {
          console.error('Error fetching student data:', error);
          setError('Error loading student data. Please try again.');
          setLoading(false);
        }
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId, isSchoolAdmin, userSchoolId]);

  useEffect(() => {
    const loadStepData = async () => {
      try {
        switch (activeStep) {
          case 1: // Academic Information
            const academicResponse = await api.get(`/students/${editingStudent.id}/academics`);
            if (academicResponse.data?.data?.[0]) {
              const academicData = academicResponse.data.data[0];
              setAcademicInfo({
                academicYear: academicData.academicYear || academicData.academic_year || '',
                grade: academicData.grade || '',
                section: academicData.section || '',
                rollNumber: academicData.rollNumber || academicData.roll_number || '',
                previousSchool: academicData.previousSchool || academicData.previous_school || '',
                admissionDate: academicData.admissionDate || academicData.admission_date ? 
                  new Date(academicData.admissionDate || academicData.admission_date).toISOString().split('T')[0] : '',
                board: academicData.board || ''
              });
            } else {
              // If no academic data exists, set default empty values
              setAcademicInfo({
                academicYear: '',
                grade: '',
                section: '',
                rollNumber: '',
                previousSchool: '',
                admissionDate: '',
                board: ''
              });
            }
            break;

          case 2: // Medical Information
            const medicalResponse = await api.get(`/students/${editingStudent.id}/medicals`);
            if (medicalResponse.data?.data?.[0]) {
              const medicalData = medicalResponse.data.data[0];
              setMedicalInfo({
                blood_group: medicalData.blood_group || medicalData.bloodGroup || '',
                medical_conditions: medicalData.medical_conditions || medicalData.medicalConditions || '',
                allergies: medicalData.allergies || '',
                medications: medicalData.medications || '',
                immunizations: medicalData.immunizations || '',
                emergency_contact_name: medicalData.emergency_contact_name || medicalData.emergencyContactName || '',
                emergency_contact_number: medicalData.emergency_contact_number || medicalData.emergencyContactNumber || '',
                family_doctor_name: medicalData.family_doctor_name || medicalData.familyDoctorName || '',
                family_doctor_number: medicalData.family_doctor_number || medicalData.familyDoctorNumber || '',
                preferred_hospital: medicalData.preferred_hospital || medicalData.preferredHospital || '',
                medical_insurance: medicalData.medical_insurance || medicalData.medicalInsurance || '',
                special_needs: medicalData.special_needs || medicalData.specialNeeds || '',
                dietary_restrictions: medicalData.dietary_restrictions || medicalData.dietaryRestrictions || '',
                physical_disabilities: medicalData.physical_disabilities || medicalData.physicalDisabilities || '',
                last_physical_exam: medicalData.last_physical_exam || medicalData.lastPhysicalExam ? 
                  new Date(medicalData.last_physical_exam || medicalData.lastPhysicalExam).toISOString().split('T')[0] : '',
                additional_notes: medicalData.additional_notes || medicalData.additionalNotes || ''
              });
            }
            break;

          case 3: // Emergency Contacts
            const contactsResponse = await api.get(`/students/${editingStudent.id}/emergency-contacts`);
            if (contactsResponse.data?.data?.[0]) {
              const contactData = contactsResponse.data.data[0];
              setEmergencyContacts({
                contact_name: contactData.contact_name || contactData.contactName || '',
                relationship: contactData.relationship || '',
                phone_number: contactData.phone_number || contactData.phoneNumber || '',
                email: contactData.email || '',
                home_address: contactData.home_address || contactData.homeAddress || '',
                alternate_contact_name: contactData.alternate_contact_name || contactData.alternateContactName || '',
                alternate_contact_relationship: contactData.alternate_contact_relationship || contactData.alternateContactRelationship || '',
                alternate_contact_number: contactData.alternate_contact_number || contactData.alternateContactNumber || '',
                communication_preference: contactData.communication_preference || contactData.communicationPreference || ''
              });
            }
            break;

          case 4: // Fee Structure
            const feeResponse = await api.get(`/students/${editingStudent.id}/fees`);
            if (feeResponse.data?.data?.[0]) {
              const feeData = feeResponse.data.data[0];
              setFeeStructure({
                feeType: feeData.fee_type || feeData.feeType || '',
                academicYear: feeData.academic_year || feeData.academicYear || '',
                term: feeData.term || '',
                amount: (feeData.amount || '').toString(),
                amountPaid: (feeData.amount_paid || feeData.amountPaid || '').toString(),
                balance: (feeData.balance || '').toString(),
                dueDate: feeData.due_date || feeData.dueDate ? 
                  new Date(feeData.due_date || feeData.dueDate).toISOString().split('T')[0] : '',
                paymentStatus: feeData.payment_status || feeData.paymentStatus || '',
                paymentMethod: feeData.payment_method || feeData.paymentMethod || '',
                transactionId: feeData.transaction_id || feeData.transactionId || '',
                receiptNumber: feeData.receipt_number || feeData.receiptNumber || '',
                remarks: feeData.remarks || '',
                paymentDate: feeData.payment_date || feeData.paymentDate ? 
                  new Date(feeData.payment_date || feeData.paymentDate).toISOString().split('T')[0] : '',
                collectedBy: feeData.collected_by || feeData.collectedBy || '',
                isCancelled: feeData.is_cancelled || feeData.isCancelled || false,
                cancellationReason: feeData.cancellation_reason || feeData.cancellationReason || ''
              });
            }
            break;
        }
      } catch (error: any) {
        // Handle 404 gracefully - this means no academic record exists yet
        if (error.response?.status === 404) {
          console.log('No record exists for this student yet');
        } else {
          console.error(`Error loading data for step ${activeStep}:`, error);
        }
      }
    };

    loadStepData();
  }, [editingStudent?.id, activeStep, open]);

  const handleInputChange = (section: string, field: string, value: any) => {
    switch (section) {
      case 'basic':
        setBasicInfo((prev: BasicInfo) => ({ ...prev, [field]: value || '' }));
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
        // Log the values for debugging
        console.log('Validating Basic Info:', {
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName,
          dateOfBirth: basicInfo.dateOfBirth,
          gender: basicInfo.gender,
          grade: basicInfo.grade,
          schoolId: basicInfo.schoolId
        });
        
        if (!basicInfo.firstName?.trim() || 
            !basicInfo.lastName?.trim() || 
            !basicInfo.dateOfBirth?.trim() || 
            !basicInfo.gender?.trim() || 
            !basicInfo.grade?.trim() || 
            !basicInfo.schoolId?.toString().trim()) {  // Convert to string and check if empty
          const missingFields = [];
          if (!basicInfo.firstName?.trim()) missingFields.push('First Name');
          if (!basicInfo.lastName?.trim()) missingFields.push('Last Name');
          if (!basicInfo.dateOfBirth?.trim()) missingFields.push('Date of Birth');
          if (!basicInfo.gender?.trim()) missingFields.push('Gender');
          if (!basicInfo.grade?.trim()) missingFields.push('Grade');
          if (!basicInfo.schoolId?.toString().trim()) missingFields.push('School');
          
          setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
          return false;
        }
        break;
      case 1:
        if (!academicInfo.academicYear || !academicInfo.grade || !academicInfo.section) {
          setError('Please fill in all required fields: Academic Year, Grade, and Section are required');
          return false;
        }
        break;
      case 2:
        // Add medical info validation if needed
        break;
      case 3:
        if (!emergencyContacts.contact_name || !emergencyContacts.relationship || !emergencyContacts.phone_number) {
          setError('Please fill in all required emergency contact fields');
          return false;
        }
        break;
      case 4:
        if (!feeStructure.feeType || !feeStructure.academicYear || !feeStructure.amount || !feeStructure.dueDate) {
          setError('Please fill in all required fee structure fields');
          return false;
        }
        break;
    }
    return true;
  };

  const getDataForStep = (step: number) => {
    switch (step) {
      case 0:
        return {
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName,
          middleName: basicInfo.middleName,
          dateOfBirth: basicInfo.dateOfBirth,
          gender: basicInfo.gender,
          grade: basicInfo.grade,
          schoolId: basicInfo.schoolId,
          status: basicInfo.status,
          parentEmail: basicInfo.parentEmail,
        };
      case 1:
        return {
          academic_year: academicInfo.academicYear,
          grade: academicInfo.grade,
          section: academicInfo.section,
          roll_number: academicInfo.rollNumber,
          previous_school: academicInfo.previousSchool,
          admission_date: academicInfo.admissionDate,
          board: academicInfo.board,
        };
      case 2:
        return medicalInfo;
      case 3:
        return emergencyContacts;
      case 4:
        return feeStructure;
      default:
        return {};
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setError('');
    setStudentId(null);
    setBasicInfo({
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: new Date().toISOString().split('T')[0],
      gender: '',
      grade: '',
      schoolId: isSchoolAdmin && userSchoolId ? userSchoolId || '' : '',  // Handle null case
      status: 'active',
      parentEmail: '',
    });
    setAcademicInfo({
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      grade: '1',
      section: 'A',
      rollNumber: '001',
      previousSchool: '',
      admissionDate: new Date().toISOString().split('T')[0],
      board: 'State Board',
    });
    setMedicalInfo({
      blood_group: 'O+',
      medical_conditions: 'None',
      allergies: 'None',
      medications: 'None',
      immunizations: 'Up to date',
      emergency_contact_name: 'Emergency Contact',
      emergency_contact_number: '1234567890',
      family_doctor_name: 'Dr. Smith',
      family_doctor_number: '9876543210',
      preferred_hospital: 'City Hospital',
      medical_insurance: 'Yes',
      special_needs: 'None',
      dietary_restrictions: 'None',
      physical_disabilities: 'None',
      last_physical_exam: new Date().toISOString().split('T')[0],
      additional_notes: 'None',
    });
    setEmergencyContacts({
      contact_name: 'Emergency Contact',
      relationship: 'Parent',
      phone_number: '1234567890',
      email: 'emergency@example.com',
      home_address: '123 Main St',
      alternate_contact_name: 'Alternate Contact',
      alternate_contact_relationship: 'Relative',
      alternate_contact_number: '9876543210',
      communication_preference: 'Phone',
    });
    setFeeStructure({
      feeType: 'Tuition',
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      term: '1',
      amount: '10000',
      amountPaid: '0',
      balance: '10000',
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      paymentStatus: 'Pending',
      paymentMethod: 'Cash',
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
        parentEmail: basicInfo.parentEmail, // Add parent email field
      };

      let response;
      if (editingStudent) {
        response = await api.put(`/students/${studentId}`, studentData);
      } else {
        response = await api.post('/students', studentData);
        setStudentId(response.data.data.id);
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
        return 'academics';
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

  const handleNext = async () => {
    try {
      if (!validateStep()) {
        return;
      }

      setLoading(true);
      setError(null);

      // Save data for the current step
      const endpoint = getEndpointForStep(activeStep);
      const data = getDataForStep(activeStep);

      // Only save basic info when creating a new student
      if (activeStep === 0) {
        if (!editingStudent) {
          const studentData = {
            firstName: basicInfo.firstName,
            lastName: basicInfo.lastName,
            middleName: basicInfo.middleName,
            dateOfBirth: basicInfo.dateOfBirth,
            gender: basicInfo.gender,
            grade: basicInfo.grade,
            schoolId: basicInfo.schoolId,
            status: basicInfo.status,
            parentEmail: basicInfo.parentEmail,
          };

          const response = await api.post('/students', studentData);
          setStudentId(response.data.data.id);
        } else {
          // Update basic info for existing student
          await api.put(`/students/${studentId}`, data);
        }
      } else if (studentId) {
        // Save data for other steps
        try {
          // For a new student or when no data exists, directly use POST
          if (!editingStudent) {
            await api.post(`/students/${studentId}/${endpoint}`, data);
          } else {
            // For existing students, check if data exists
            const existingData = await api.get(`/students/${studentId}/${endpoint}`);
            if (existingData.data?.data?.[0]?.id) {
              await api.put(`/students/${studentId}/${endpoint}/${existingData.data.data[0].id}`, data);
            } else {
              await api.post(`/students/${studentId}/${endpoint}`, data);
            }
          }
        } catch (error: any) {
          // If there's a 404 error (no data exists), use POST
          if (error.response?.status === 404) {
            await api.post(`/students/${studentId}/${endpoint}`, data);
          } else {
            throw error; // Re-throw other errors to be caught by the outer try-catch
          }
        }
      }

      const isLastStep = activeStep === steps.length - 1;
      
      if (isLastStep) {
        // Only call onComplete and close form on the last step
        if (onComplete) {
          onComplete({ data: { id: studentId } });
        }
        handleClose();
        return;
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

  const closeForm = () => {
    resetForm();
    handleClose();
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
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Parent Email"
          value={basicInfo.parentEmail}
          onChange={(e) => handleInputChange('basic', 'parentEmail', e.target.value)}
          error={!!error && !basicInfo.parentEmail}
          helperText={!!error && !basicInfo.parentEmail ? 'Parent email is required' : ''}
        />
      </Grid>
      {isSchoolAdmin && (
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="School"
            value={schools.find(school => school.id === userSchoolId)?.name || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      )}
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
