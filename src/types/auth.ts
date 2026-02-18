import type { JwtPayload } from "jsonwebtoken";
import type { SafeUser } from "./user.js";


export interface AuthPayload extends JwtPayload {
  id: string;
  role: "user" | "admin";
}

export interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
};

export type AuthResult = {
  safeUser: SafeUser;
  accessToken: string;
  refreshToken: string;
};