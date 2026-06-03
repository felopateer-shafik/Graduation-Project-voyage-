import { z } from 'zod';

/** Login form schema */
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/** Registration form schema */
export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/** Search form schema */
export const searchSchema = z.object({
  from: z.string().min(1, 'Please select departure'),
  to: z.string().min(1, 'Please select destination'),
  departDate: z.string().min(1, 'Please select departure date'),
  returnDate: z.string().optional(),
  travelers: z.number().min(1).max(9),
});

/** Payment form schema */
export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardHolderName: z.string().min(2, 'Please enter cardholder name'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});
