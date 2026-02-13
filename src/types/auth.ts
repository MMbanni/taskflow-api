import mongoose from "mongoose";
import type { ObjectId } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import type { SafeUser } from "./user.js";


export interface AuthPayload extends JwtPayload {
  id: ObjectId;
  role: "user" | "admin";
}


export interface RefreshToken {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
};

export type AuthResult = {
  safeUser: SafeUser;
  accessToken: string;
  refreshToken: string;
};