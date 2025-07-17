import { Request, Response } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} from './user.service';

// Utility for cleaner error responses
const respondWithError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ error: message });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return respondWithError(res, 400, 'Email and password are required');
    }

    const { token, user } = await loginUser(email, password);
    return res.status(200).json({ token, user });
  } catch (error: any) {
    return respondWithError(res, 401, error.message || 'Invalid credentials');
  }
};

// CREATE USER
export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email) return respondWithError(res, 400, 'Email is required');
    if (!password) return respondWithError(res, 400, 'Password is required');
    if (!first_name) return respondWithError(res, 400, 'First name is required');
    if (!last_name) return respondWithError(res, 400, 'Last name is required');

    const { user, token } = await createUser(req.body);
    return res.status(201).json({ user, token });
  } catch (error: any) {
    const message = error.message?.toLowerCase() || '';

    if (message.includes('email already in use')) {
      return respondWithError(res, 409, 'Email already in use');
    }

    return respondWithError(res, 500, 'Failed to create user');
  }
};

// GET ALL USERS
export const handleGetUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return respondWithError(res, 500, 'Failed to fetch users');
  }
};

// GET USER BY ID
export const handleGetUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return respondWithError(res, 400, 'Invalid user ID');
  }

  try {
    const user = await getUserById(userId);
    if (!user) return respondWithError(res, 404, 'User not found');
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return respondWithError(res, 500, 'Failed to fetch user');
  }
};

// UPDATE USER
export const handleUpdateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return respondWithError(res, 400, 'Invalid user ID');
  }

  try {
    const updated = await updateUser(userId, req.body);
    if (!updated) return respondWithError(res, 404, 'User not found');
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    return respondWithError(res, 500, 'Failed to update user');
  }
};

// DELETE USER
export const handleDeleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return respondWithError(res, 400, 'Invalid user ID');
  }

  try {
    const deleted = await deleteUser(userId);
    if (!deleted) return respondWithError(res, 404, 'User not found');
    return res.status(200).json({ message: 'User deleted successfully', deleted });
  } catch (error) {
    console.error('Error deleting user:', error);
    return respondWithError(res, 500, 'Failed to delete user');
  }
};
