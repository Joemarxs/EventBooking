import db from '../drizzle/db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { TIUser } from '../drizzle/schema';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';


export const loginUser = async (email: string, password: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { userId: user.user_id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return { token, user };
};


// CREATE USER 

export const createUser = async (data: TIUser) => {
  try {
    const {
      user_id, 
      createdAt,
      updatedAt,
      password,
      email,
      ...safeData
    } = data;

    if (!password) throw new Error('Password is required');
    if (!email) throw new Error('Email is required');

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [inserted] = await db
      .insert(users)
      .values({
        ...safeData,
        email,
        password: hashedPassword,
        createdAt: new Date(createdAt ?? Date.now()),
        updatedAt: new Date(updatedAt ?? Date.now()),
      })
      .returning();

    const token = jwt.sign(
      { userId: inserted.user_id, email: inserted.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user: inserted };

  } catch (error: any) {
    if (error.message === 'Password is required') {
      throw new Error('Password must be provided');
    }
    if (error.message === 'Email is required') {
      throw new Error('Email must be provided');
    }
    if (error.message === 'Email already in use') {
      throw new Error('This email address is already registered');
    }

    console.error('User registration failed:', error);
    throw new Error('Something went wrong during registration');
  }
};


// GET ALL USERS 
export const getAllUsers = async () => {
  return await db.select().from(users);
};

// GET USER BY ID
export const getUserById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.user_id, id));
  return user;
};

// UPDATE USER 
export const updateUser = async (id: number, data: Partial<TIUser>) => {
  const { user_id, createdAt, updatedAt, ...safeData } = data;

  const [updated] = await db
    .update(users)
    .set({
      ...safeData,
      updatedAt: new Date(), // always set to current timestamp
    })
    .where(eq(users.user_id, id))
    .returning();

  return updated;
};

// DELETE USER 
export const deleteUser = async (id: number) => {
  const [deleted] = await db
    .delete(users)
    .where(eq(users.user_id, id))
    .returning();
  return deleted;
};
