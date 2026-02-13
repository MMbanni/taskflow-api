import crypto from 'crypto';

import jwt from "jsonwebtoken";

import { config } from "../../config/config.js";
import type { UserDoc } from "../users/user.schema.js";

export function createAccessToken(user: Pick<UserDoc, '_id' | 'role'>): string {
    const accessToken = jwt.sign(
        {
            id: user._id.toString(),
            role: user.role,
        },
        config.jwtSecret,
        { expiresIn: '100m' }

    );
    return accessToken;
}

export function generateRefreshToken() {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return { token, expiresAt };
}