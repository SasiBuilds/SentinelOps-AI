import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

const defaultUsers = [
  {
    email: 'admin@sentinelops.com',
    name: 'Administrator',
    role: 'ADMIN',
    password: 'Admin@123',
  },
  {
    email: 'operator@sentinelops.com',
    name: 'Operator',
    role: 'OPERATOR',
    password: 'Operator@123',
  },
  {
    email: 'viewer@sentinelops.com',
    name: 'Viewer',
    role: 'VIEWER',
    password: 'Viewer@123',
  },
];

async function main() {
  console.log('Starting Prisma seed...');

  for (const user of defaultUsers) {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });

    if (existingUser) {
      console.log(`User already exists: ${user.email}`);
      continue;
    }

    const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);

    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        passwordHash,
        role: user.role,
      },
    });

    console.log(`Created user: ${user.email} (${user.role})`);
  }

  console.log('Prisma seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Prisma seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
