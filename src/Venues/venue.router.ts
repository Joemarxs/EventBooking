import { Router } from 'express';
import {
  handleCreateVenue,
  handleGetAllVenues,
  handleGetVenueById,
  handleUpdateVenue,
  handleDeleteVenue,
} from './venue.controller';

const router = Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      await handleGetAllVenues(req, res);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      await handleCreateVenue(req, res);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      await handleGetVenueById(req, res);
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      await handleUpdateVenue(req, res);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await handleDeleteVenue(req, res);
    } catch (err) {
      next(err);
    }
  });

export default router;
