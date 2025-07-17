import { Router } from 'express';
import {
  handleCreateUser,
  handleGetUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  login,
} from './user.controller';

const router = Router();


router.route('/login').post(async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    next(err);
  }
});

// post 
router.route('/').post(async (req, res, next) => {
  try {
    await handleCreateUser(req, res);
  } catch (err) {
    next(err);
  }
});

//get all
router.route('/').get(async (req, res, next) => {
  try {
    await handleGetUsers(req, res);
  } catch (err) {
    next(err);
  }
});

//get by id
router.route('/:id').get(async (req, res, next) => {
  try {
    await handleGetUserById(req, res);
  } catch (err) {
    next(err);
  }
});

//update
router.route('/:id').put(async (req, res, next) => {
  try {
    await handleUpdateUser(req, res);
  } catch (err) {
    next(err);
  }
});

//delete
router.route('/:id').delete(async (req, res, next) => {
  try {
    await handleDeleteUser(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
