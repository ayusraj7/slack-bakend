import { z } from 'zod';

export const userSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only letters and numbers'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const userSignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});
