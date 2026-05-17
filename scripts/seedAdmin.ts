import { connectDB } from '../src/lib/db';
import { User } from '../src/models/User';
import { hashPassword } from '../src/lib/auth';

(async () => {
  await connectDB();
  const exists = await User.findOne({ email: 'admin@shop.com' });
  if (!exists) {
    await User.create({
      name: 'Admin',
      email: 'admin@shop.com',
      password: await hashPassword('admin123'),
      role: 'admin',
    });
    console.log('Admin created: admin@shop.com / admin123');
  }
  process.exit(0);
})();