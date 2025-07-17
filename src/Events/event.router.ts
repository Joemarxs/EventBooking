import express from 'express';
import {
  handleGetEvents,
  handleGetEvent,
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent,
} from './event.controller';

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      await handleGetEvents(req, res);
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      await handleCreateEvent(req, res);
    } catch (err) {
      next(err);
    }
  });

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      await handleGetEvent(req, res);
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      await handleUpdateEvent(req, res);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await handleDeleteEvent(req, res);
    } catch (err) {
      next(err);
    }
  });

export default router;
