import { User, UserRole } from '../User';
import { testDataSource } from '../../test/setup';

describe('User Model', () => {
  let userRepository: any;

  beforeAll(() => {
    userRepository = testDataSource.getRepository(User);
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  it('should create a new user', async () => {
    const user = userRepository.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.TEACHER,
    });

    await userRepository.save(user);
    const savedUser = await userRepository.findOne({ where: { email: 'john@example.com' } });

    expect(savedUser).toBeDefined();
    expect(savedUser?.email).toBe('john@example.com');
    expect(savedUser?.firstName).toBe('John');
    expect(savedUser?.lastName).toBe('Doe');
    expect(savedUser?.role).toBe(UserRole.TEACHER);
  });

  it('should hash the password before saving', async () => {
    const user = userRepository.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: UserRole.STUDENT,
    });

    await userRepository.save(user);
    const savedUser = await userRepository.findOne({ where: { email: 'jane@example.com' } });

    expect(savedUser).toBeDefined();
    expect(savedUser?.password).not.toBe('password123');
    expect(savedUser?.password).toMatch(/^\$2[aby]\$\d+\$/);
  });

  it('should not allow duplicate emails', async () => {
    const user1 = userRepository.create({
      firstName: 'User',
      lastName: 'One',
      email: 'duplicate@example.com',
      password: 'password123',
      role: UserRole.STUDENT,
    });

    await userRepository.save(user1);

    const user2 = userRepository.create({
      firstName: 'User',
      lastName: 'Two',
      email: 'duplicate@example.com',
      password: 'password456',
      role: UserRole.STUDENT,
    });

    await expect(userRepository.save(user2)).rejects.toThrow();
  });
});
