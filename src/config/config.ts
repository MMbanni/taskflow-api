import "dotenv/config";

function must(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }

  return value;
}

export const config = {
  jwtSecret: must("JWT_SECRET"),
  mongoUri: must("MONGO_URI"),
  port: Number(process.env.PORT ?? 3000),
  mailUser: must("USER"),
  mailAppPass: must("APP_PASS")
};
