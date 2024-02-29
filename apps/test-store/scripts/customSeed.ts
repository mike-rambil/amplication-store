import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

export async function customSeed(numberOfUsers: number = 10): Promise<void> {
  const client = new PrismaClient();

  async function createUser(): Promise<void> {
    const saltRounds = 10;
    const passwordHash = await hash(faker.internet.password(), saltRounds);

    await client.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: passwordHash,
        roles: ['user'], // Example roles
        username: faker.internet.userName(),
      },
    });
  }

  try {
    for (let i = 0; i < numberOfUsers; i++) {
      await createUser();
    }
    console.log(`${numberOfUsers} users created successfully.`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await client.$disconnect();
  }
}
