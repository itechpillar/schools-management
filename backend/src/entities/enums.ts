// src/entities/enums.ts
export enum FeeType {
  TUITION = 'tuition',
  EXAM = 'exam',
  TRANSPORT = 'transport',
  LIBRARY = 'library',
  LABORATORY = 'laboratory',
  SPORTS = 'sports',
  MISCELLANEOUS = 'miscellaneous'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHEQUE = 'cheque',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}