import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const createDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log("🔐 Default admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword!, 12);

  const adminUser = new User({
    username: adminUsername,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
  });

  await adminUser.save();
  console.log(`✅ Default admin created: ${adminEmail}`);
};
