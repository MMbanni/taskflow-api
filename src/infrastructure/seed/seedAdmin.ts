import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../../modules/users/user.schema.js';
import { BCRYPT_SALT_ROUNDS } from '../../config/config.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function seedAdmin() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI missing');
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be provided");
  }
  try {
    await mongoose.connect(MONGO_URI);

    console.log('Connected to DB');

    const existingAdmin = await UserModel.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin already exists. Skipping.');
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);

      await UserModel.create({
        username: 'admin',
        usernameNormalized: 'admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });

      console.log('Admin user created.');
    }
  }  
  finally {
    await mongoose.disconnect();
  }
}

seedAdmin()
.then(()=> { process.exit(0)})
.catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});