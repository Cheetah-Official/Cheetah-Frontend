import { client } from "@/lib/api/client";
import { clearAccessToken, setAccessToken } from "@/lib/auth";
import {
  PasswordReset,
  PasswordResetRequest,
  Token,
  UserLogin,
  UserRegister,
  UserResponse,
  VerifyTokenRequest,
} from "@/lib/api/schemas/auth";
import { z } from "zod";

export const authApi = {
  // JSON login endpoint: POST /auth/login -> Token
  async login(payload: z.infer<typeof UserLogin>) {
    const body = UserLogin.parse(payload);
    const token = await client.post<z.infer<typeof Token>>("/auth/login", body);
    // Persist for client-side usage
    setAccessToken(token.access_token);
    return token;
  },

  // OAuth2 password flow: POST /auth/token (form-urlencoded) -> Token
  async tokenLogin({ username, password }: { username: string; password: string }) {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const token = await client.post<z.infer<typeof Token>>(
      "/auth/token",
      form.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    setAccessToken(token.access_token);
    return token;
  },

  // POST /auth/register -> UserResponse
  async register(payload: z.infer<typeof UserRegister>) {
    const body = UserRegister.parse(payload);
    const user = await client.post<z.infer<typeof UserResponse>>("/auth/register", body);
    return user;
  },

  // GET /auth/me -> UserResponse
  async me() {
    return client.get<z.infer<typeof UserResponse>>("/auth/me");
  },

  // POST /auth/logout -> { message }
  async logout() {
    const res = await client.post<{ message: string }>("/auth/logout", {});
    clearAccessToken();
    return res;
  },

  // POST /auth/password-reset-request
  async passwordResetRequest(payload: z.infer<typeof PasswordResetRequest>) {
    const body = PasswordResetRequest.parse(payload);
    return client.post<{ message: string }>("/auth/password-reset-request", body);
  },

  // POST /auth/password-reset
  async passwordReset(payload: z.infer<typeof PasswordReset>) {
    const body = PasswordReset.parse(payload);
    return client.post<{ message: string }>("/auth/password-reset", body);
  },

  // POST /auth/verify-token
  async verifyToken(payload: z.infer<typeof VerifyTokenRequest>) {
    const body = VerifyTokenRequest.parse(payload);
    return client.post<{ valid: boolean; message?: string }>("/auth/verify-token", body);
  },
};
