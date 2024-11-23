/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - gender
 *         - schoolId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated UUID of the student
 *         firstName:
 *           type: string
 *           description: Student's first name
 *         middleName:
 *           type: string
 *           description: Student's middle name (optional)
 *         lastName:
 *           type: string
 *           description: Student's last name
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Student's date of birth
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Student's gender
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *           default: active
 *           description: Student's current status
 *         photoUrl:
 *           type: string
 *           description: URL to student's photo (optional)
 *         photoPublicId:
 *           type: string
 *           description: Public ID of student's photo in cloud storage (optional)
 *         schoolId:
 *           type: string
 *           format: uuid
 *           description: ID of the school the student belongs to
 *         grade:
 *           type: string
 *           description: Student's current grade
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the record was last updated
 * 
 *     StudentAcademic:
 *       type: object
 *       required:
 *         - academicYear
 *         - currentGrade
 *       properties:
 *         previousSchool:
 *           type: string
 *         academicYear:
 *           type: string
 *         currentGrade:
 *           type: string
 *         classSection:
 *           type: string
 *         achievements:
 *           type: string
 *         extraCurricular:
 *           type: string
 * 
 *     StudentMedical:
 *       type: object
 *       properties:
 *         bloodGroup:
 *           type: string
 *         medicalConditions:
 *           type: string
 *         allergies:
 *           type: string
 *         medications:
 *           type: string
 *         doctorName:
 *           type: string
 *         doctorContact:
 *           type: string
 *         insuranceInfo:
 *           type: string
 * 
 *     StudentEmergencyContact:
 *       type: object
 *       required:
 *         - contactName
 *         - relationship
 *         - phoneNumber
 *         - homeAddress
 *       properties:
 *         contactName:
 *           type: string
 *         relationship:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         email:
 *           type: string
 *         homeAddress:
 *           type: string
 *         alternateContactName:
 *           type: string
 *         alternateContactRelationship:
 *           type: string
 *         alternateContactNumber:
 *           type: string
 *         communicationPreference:
 *           type: string
 * 
 *     StudentFee:
 *       type: object
 *       required:
 *         - feeType
 *         - amount
 *         - dueDate
 *       properties:
 *         feeType:
 *           type: string
 *           enum: [tuition, transport, library, laboratory, sports, other]
 *         amount:
 *           type: number
 *           format: float
 *         dueDate:
 *           type: string
 *           format: date
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, overdue]
 *           default: pending
 *         paymentMethod:
 *           type: string
 *           enum: [cash, card, bank_transfer, cheque]
 *         paymentDate:
 *           type: string
 *           format: date
 *         receiptNumber:
 *           type: string
 * 
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires SUPER_ADMIN role
 * 
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 * 
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 * 
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       403:
 *         description: Forbidden - Requires SUPER_ADMIN role
 *       404:
 *         description: Student not found
 * 
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       403:
 *         description: Forbidden - Requires SUPER_ADMIN role
 *       404:
 *         description: Student not found
 * 
 * /api/students/{id}/details:
 *   get:
 *     summary: Get complete student details including academics, medical, and emergency contacts
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Complete student details
 *       404:
 *         description: Student not found
 * 
 * /api/students/{id}/academics:
 *   get:
 *     summary: Get student's academic records
 *     tags: [Student Academics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student's academic records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentAcademic'
 * 
 *   post:
 *     summary: Create student's academic record
 *     tags: [Student Academics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentAcademic'
 *     responses:
 *       201:
 *         description: Academic record created successfully
 * 
 * /api/students/{id}/medical:
 *   get:
 *     summary: Get student's medical records
 *     tags: [Student Medical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student's medical records
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentMedical'
 * 
 *   post:
 *     summary: Create student's medical record
 *     tags: [Student Medical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentMedical'
 *     responses:
 *       201:
 *         description: Medical record created successfully
 * 
 * /api/students/{id}/emergency-contacts:
 *   get:
 *     summary: Get student's emergency contacts
 *     tags: [Student Emergency Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student's emergency contacts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentEmergencyContact'
 * 
 *   post:
 *     summary: Create student's emergency contact
 *     tags: [Student Emergency Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentEmergencyContact'
 *     responses:
 *       201:
 *         description: Emergency contact created successfully
 * 
 * /api/students/{id}/fees:
 *   get:
 *     summary: Get student's fees
 *     tags: [Student Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Student's fees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentFee'
 * 
 *   post:
 *     summary: Create student fee record
 *     tags: [Student Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentFee'
 *     responses:
 *       201:
 *         description: Fee record created successfully
 * 
 * /api/students/{id}/fees/{feeId}:
 *   put:
 *     summary: Update fee status
 *     tags: [Student Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: feeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, overdue]
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, bank_transfer, cheque]
 *               paymentDate:
 *                 type: string
 *                 format: date
 *               receiptNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fee status updated successfully
 */
