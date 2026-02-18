import 'dotenv/config';
import type { StringValue } from 'ms';

export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

function must(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }

  return value;
}

export const config = {
  jwtSecret: must('JWT_SECRET'),
  jwtAccessExpiry: must('JWT_ACCESS_EXPIRY') as StringValue,
  jwtRefreshExpiry: must('JWT_REFRESH_EXPIRY') as StringValue,
  mongoUri: must('MONGO_URI'),
  port: Number(process.env.PORT ?? 3000),
  mailUser: must('MAIL_USER'),
  mailAppPass: must('MAIL_APP_PASS')
};
