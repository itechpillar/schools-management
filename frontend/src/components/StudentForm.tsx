import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tab,
  Tabs,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  SelectChangeEvent,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface ImmunizationRecord {
  vaccineName: string;
  dateAdministered: string;
  nextDueDate?: string;
  notes?: string;
}

interface FeeStructure {
  type: 'tuition' | 'exams' | 'extraCurricular' | 'other';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  notes?: string;
}

interface StudentFormData {
  // Basic Information
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  studentId?: string;
  photograph?: string;

  // Contact Details
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  parentGuardianName?: string;
  parentGuardianPhone?: string;
  parentGuardianEmail?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Academic Information
  grade: string;
  schoolId: string;
  section?: string;
  rollNumber?: string;
  previousSchool?: string;
  admissionDate?: string;
  academicYear?: string;
  slcNumber?: string;
  board?: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Other';
  otherBoard?: string;
  gpa?: string;
  status: 'active' | 'inactive';

  // Health Information
  bloodGroup?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
  doctorName?: string;
  doctorPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  immunizationRecords?: ImmunizationRecord[];

  // Fees and Payments Information
  feeStructure?: FeeStructure[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StudentFormProps {
  open: boolean;
  handleClose: () => void;
  handleSave: (formData: StudentFormData) => void;
  editingStudent: any;
  schools: any[];
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const StudentForm: React.FC<StudentFormProps> = ({
  open,
  handleClose,
  handleSave,
  editingStudent,
  schools,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    grade: '',
    schoolId: '',
    status: 'active',
  });

  const [immunizationForm, setImmunizationForm] = useState<ImmunizationRecord>({
    vaccineName: '',
    dateAdministered: '',
    nextDueDate: '',
    notes: '',
  });

  const [feeForm, setFeeForm] = useState<FeeStructure>({
    type: 'tuition',
    amount: 0,
    dueDate: '',
    status: 'pending',
    notes: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Add GPA validation
    if (name === 'gpa') {
      const gpaValue = parseFloat(value);
      if (!isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 10) {
        setFormData((prev: StudentFormData) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    setFormData((prev: StudentFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImmunizationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImmunizationForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeeForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeeSelectChange = (e: SelectChangeEvent<string>) => {
    const { target: { name, value } } = e;
    setFeeForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: StudentFormData) => ({
          ...prev,
          photograph: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: StudentFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addImmunizationRecord = () => {
    if (immunizationForm.vaccineName && immunizationForm.dateAdministered) {
      setFormData(prev => ({
        ...prev,
        immunizationRecords: [
          ...(prev.immunizationRecords || []),
          { ...immunizationForm },
        ],
      }));
      setImmunizationForm({
        vaccineName: '',
        dateAdministered: '',
        nextDueDate: '',
        notes: '',
      });
    }
  };

  const removeImmunizationRecord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      immunizationRecords: prev.immunizationRecords?.filter((_, i) => i !== index),
    }));
  };

  const addFeeRecord = () => {
    if (feeForm.amount > 0 && feeForm.dueDate) {
      setFormData(prev => ({
        ...prev,
        feeStructure: [
          ...(prev.feeStructure || []),
          { ...feeForm },
        ],
      }));
      setFeeForm({
        type: 'tuition',
        amount: 0,
        dueDate: '',
        status: 'pending',
        notes: '',
      });
    }
  };

  const removeFeeRecord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      feeStructure: prev.feeStructure?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingStudent ? 'Edit Student' : 'Add New Student'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Basic Information" />
            <Tab label="Contact Details" />
            <Tab label="Academic Information" />
            <Tab label="Health Information" />
            <Tab label="Fees & Payments" />
          </Tabs>
        </Box>

        {/* Basic Information */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    border: '1px dashed grey',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  {formData.photograph ? (
                    <img
                      src={formData.photograph}
                      alt="Student"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography color="textSecondary">No photo</Typography>
                  )}
                  <input
                    accept="image/*"
                    type="file"
                    id="photo-upload"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Middle Name"
                name="middleName"
                value={formData.middleName || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contact Details */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent/Guardian Name"
                name="parentGuardianName"
                value={formData.parentGuardianName || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent/Guardian Phone"
                name="parentGuardianPhone"
                value={formData.parentGuardianPhone || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Academic Information */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>School</InputLabel>
                <Select
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleSelectChange}
                  required
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
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section"
                name="section"
                value={formData.section || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Previous School (If Applicable)"
                name="previousSchool"
                value={formData.previousSchool || ''}
                onChange={handleInputChange}
                helperText="Enter the name of the previous school if applicable"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Leaving Certificate Number"
                name="slcNumber"
                value={formData.slcNumber || ''}
                onChange={handleInputChange}
                helperText="Enter the SLC number from previous school"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Board</InputLabel>
                <Select
                  name="board"
                  value={formData.board || ''}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="CBSE">CBSE</MenuItem>
                  <MenuItem value="ICSE">ICSE</MenuItem>
                  <MenuItem value="State Board">State Board</MenuItem>
                  <MenuItem value="IB">IB</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.board === 'Other' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Other Board Name"
                  name="otherBoard"
                  value={formData.otherBoard || ''}
                  onChange={handleInputChange}
                  helperText="Please specify the board name"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GPA"
                name="gpa"
                type="number"
                inputProps={{
                  step: "0.01",
                  min: "0",
                  max: "10"
                }}
                value={formData.gpa || ''}
                onChange={handleInputChange}
                helperText="Enter GPA on a scale of 0-10"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Date"
                name="admissionDate"
                type="date"
                value={formData.admissionDate || ''}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText="Select the date of admission"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                name="academicYear"
                value={formData.academicYear || ''}
                onChange={handleInputChange}
                helperText="e.g., 2023-2024"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Health Information */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                name="allergies"
                value={formData.allergies || ''}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Immunization Records
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Vaccine Name"
                      name="vaccineName"
                      value={immunizationForm.vaccineName}
                      onChange={handleImmunizationInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date Administered"
                      name="dateAdministered"
                      type="date"
                      value={immunizationForm.dateAdministered}
                      onChange={handleImmunizationInputChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Next Due Date"
                      name="nextDueDate"
                      type="date"
                      value={immunizationForm.nextDueDate}
                      onChange={handleImmunizationInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={immunizationForm.notes}
                      onChange={handleImmunizationInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addImmunizationRecord}
                      disabled={!immunizationForm.vaccineName || !immunizationForm.dateAdministered}
                    >
                      Add Immunization Record
                    </Button>
                  </Grid>
                </Grid>

                {formData.immunizationRecords && formData.immunizationRecords.length > 0 && (
                  <List sx={{ mt: 2 }}>
                    {formData.immunizationRecords.map((record, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={record.vaccineName}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2">
                                Administered: {new Date(record.dateAdministered).toLocaleDateString()}
                              </Typography>
                              {record.nextDueDate && (
                                <Typography component="span" variant="body2">
                                  {' • Next Due: ' + new Date(record.nextDueDate).toLocaleDateString()}
                                </Typography>
                              )}
                              {record.notes && (
                                <Typography component="span" variant="body2" color="textSecondary">
                                  <br />
                                  Notes: {record.notes}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeImmunizationRecord(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Doctor's Name"
                      name="doctorName"
                      value={formData.doctorName || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Doctor's Phone"
                      name="doctorPhone"
                      value={formData.doctorPhone || ''}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Fees and Payments Information */}
        <TabPanel value={activeTab} index={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Fee Structure
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Fee Type</InputLabel>
                      <Select
                        name="type"
                        value={feeForm.type}
                        onChange={handleFeeSelectChange}
                        label="Fee Type"
                      >
                        <MenuItem value="tuition">Tuition Fee</MenuItem>
                        <MenuItem value="exams">Exams Fee</MenuItem>
                        <MenuItem value="extraCurricular">Extra-curricular Fee</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      type="number"
                      value={feeForm.amount}
                      onChange={handleFeeInputChange}
                      InputProps={{
                        startAdornment: <span>₹</span>,
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={feeForm.dueDate}
                      onChange={handleFeeInputChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={feeForm.status}
                        onChange={handleFeeSelectChange}
                        label="Status"
                      >
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="overdue">Overdue</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={feeForm.notes}
                      onChange={handleFeeInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addFeeRecord}
                      disabled={!feeForm.amount || !feeForm.dueDate}
                    >
                      Add Fee Record
                    </Button>
                  </Grid>
                </Grid>

                {formData.feeStructure && formData.feeStructure.length > 0 && (
                  <List sx={{ mt: 2 }}>
                    {formData.feeStructure.map((fee, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography>
                              {fee.type.charAt(0).toUpperCase() + fee.type.slice(1)} Fee - ₹{fee.amount}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2">
                                Due Date: {new Date(fee.dueDate).toLocaleDateString()}
                                {' • '}
                                Status: {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                              </Typography>
                              {fee.notes && (
                                <Typography component="span" variant="body2" color="textSecondary">
                                  <br />
                                  Notes: {fee.notes}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeFeeRecord(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingStudent ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentForm;
