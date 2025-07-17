import express from 'express';
import {
  handleGetPayments,
  handleGetPayment,
  handleCreatePayment,
  handleUpdatePayment,
  handleDeletePayment
} from './payment.controller';

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      await handleGetPayments(req, res);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      await handleCreatePayment(req, res);
    } catch (err) {
      next(err);
    }
  });

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      await handleGetPayment(req, res);
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      await handleUpdatePayment(req, res);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await handleDeletePayment(req, res);
    } catch (err) {
      next(err);
    }
  });

export default router;
