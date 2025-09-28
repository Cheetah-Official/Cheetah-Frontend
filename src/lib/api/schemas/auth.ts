import { z } from "zod";

export const UserRegister = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable().optional(),
});

export const UserLogin = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const Token = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().int(),
  user_id: z.string(),
  user_email: z.string(),
  user_role: z.string(),
});

export const UserResponse = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable().optional(),
  role: z.string(),
  is_active: z.boolean(),
  is_verified: z.boolean(),
});

export const PasswordResetRequest = z.object({
  email: z.string().email(),
});

export const PasswordReset = z.object({
  token: z.string(),
  new_password: z.string().min(6),
});

export const VerifyTokenRequest = z.object({
  token: z.string(),
});

export type UserRegisterT = z.infer<typeof UserRegister>;
export type UserLoginT = z.infer<typeof UserLogin>;
export type TokenT = z.infer<typeof Token>;
export type UserResponseT = z.infer<typeof UserResponse>;
export type PasswordResetRequestT = z.infer<typeof PasswordResetRequest>;
export type PasswordResetT = z.infer<typeof PasswordReset>;
export type VerifyTokenRequestT = z.infer<typeof VerifyTokenRequest>;
