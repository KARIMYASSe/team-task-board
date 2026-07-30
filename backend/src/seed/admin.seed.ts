import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { userRepositoryService } from '../DB/repository/user.repository';
import { Hash } from '../security/hashPassword';

async function seedAdmin(): Promise<void> {
  dotenv.config({
    path: 'config/.env',
  });

  const { AppModule } = await import('../app.module');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userRepository = app.get(userRepositoryService);

    const firstName = process.env.ADMIN_FIRST_NAME;

    const lastName = process.env.ADMIN_LAST_NAME;

    const email = process.env.ADMIN_EMAIL?.toLowerCase();

    const password = process.env.ADMIN_PASSWORD;

    if (!firstName || !lastName || !email || !password) {
      throw new Error('Admin environment variables are missing');
    }

    const adminExist = await userRepository.findOne({
      email,
    });

    if (adminExist) {
      console.log(`Admin already exists: ${email}`);

      return;
    }

    await userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash: Hash(password),
      role: 'admin',
    });

    console.log(`Admin created successfully: ${email}`);
  } finally {
    await app.close();
  }
}

seedAdmin().catch((error: unknown) => {
  console.error('Admin seed failed:', error);

  process.exit(1);
});
