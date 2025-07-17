import express from 'express';
import {
  handleGetSupportRequests,
  handleGetSupportRequest,
  handleCreateSupportRequest,
  handleUpdateSupportRequest,
  handleDeleteSupportRequest,
} from './customerSupport.controller';

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      await handleGetSupportRequests(req, res);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      await handleCreateSupportRequest(req, res);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      await handleGetSupportRequest(req, res);
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      await handleUpdateSupportRequest(req, res);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await handleDeleteSupportRequest(req, res);
    } catch (err) {
      next(err);
    }
  });

export default router;
