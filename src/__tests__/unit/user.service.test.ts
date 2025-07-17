import * as userService from '../../User/user.service';
import db from '../../drizzle/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../../drizzle/schema';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockedDb = db as jest.Mocked<typeof db>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('User Service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createUser', () => {
    it('should create a new user and return token', async () => {
      mockedDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([]),
          }),
        }),
      } as any);

      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed-pass');


      mockedDb.insert.mockReturnValueOnce({
        values: () => ({
          returning: () =>
            Promise.resolve([{ user_id: 1, email: 'test@example.com' }]),
        }),
      } as any);

      (mockedJwt.sign as jest.Mock).mockReturnValue('jwt-token');


      const result = await userService.createUser({
        email: 'test@example.com',
        password: '123456',
        first_name: 'Test',
        last_name: 'User',
      } as any);

      expect(result.token).toBe('jwt-token');
      expect(result.user).toEqual({ user_id: 1, email: 'test@example.com' });
    });

    it('should throw if email already exists', async () => {
      mockedDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () => Promise.resolve([{ email: 'test@example.com' }]),
          }),
        }),
      } as any);

      await expect(
        userService.createUser({
          email: 'test@example.com',
          password: '123456',
        } as any)
      ).rejects.toThrow('This email address is already registered');
    });
  });

  describe('loginUser', () => {
    it('should login and return token', async () => {
      mockedDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () =>
              Promise.resolve([
                {
                  user_id: 1,
                  email: 'test@example.com',
                  password: 'hashed',
                },
              ]),
          }),
        }),
      } as any);

      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      (mockedJwt.sign as jest.Mock).mockReturnValue('jwt-token');


      const result = await userService.loginUser('test@example.com', '123456');

      expect(result.token).toBe('jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw on invalid password', async () => {
      mockedDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: () =>
              Promise.resolve([
                { email: 'test@example.com', password: 'hashed' },
              ]),
          }),
        }),
      } as any);

      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);


      await expect(
        userService.loginUser('test@example.com', 'wrongpass')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      mockedDb.select.mockReturnValueOnce({
        from: () => ({
          where: () => Promise.resolve([{ user_id: 1 }]),
        }),
      } as any);

      const result = await userService.getUserById(1);
      expect(result.user_id).toBe(1);
    });
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      mockedDb.update.mockReturnValueOnce({
        set: () => ({
          where: () => ({
            returning: () => Promise.resolve([{ user_id: 1 }]),
          }),
        }),
      } as any);

      const result = await userService.updateUser(1, { firstName: 'New' });

      expect(result.user_id).toBe(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete and return user', async () => {
      mockedDb.delete.mockReturnValueOnce({
        where: () => ({
          returning: () => Promise.resolve([{ user_id: 1 }]),
        }),
      } as any);

      const result = await userService.deleteUser(1);
      expect(result.user_id).toBe(1);
    });
  });
});
