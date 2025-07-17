import { Request, Response } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from './event.service';

export const handleGetEvents = async (_: Request, res: Response) => {
  try {
    const all = await getAllEvents();
    res.status(200).json(all);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const handleGetEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const handleCreateEvent = async (req: Request, res: Response) => {
  const { title, description, date, location } = req.body;

  // Basic validation for required fields
  if (!title || !description || !date || !location) {
    return res.status(400).json({
      error: 'Missing required fields: title, description, date, and location are all required.',
    });
  }

  try {
    const newEvent = await createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({
      error: (error as Error).message || 'Failed to create event',
    });
  }
};


export const handleUpdateEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const updated = await updateEvent(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const handleDeleteEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  try {
    const deleted = await deleteEvent(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found or already deleted' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err: any) {
    const pgErrorCode = err?.cause?.code || err.code;

    if (pgErrorCode === '23503') {
      return res.status(409).json({
        error: 'Cannot delete event: It is linked to payments or support.',
      });
    }

    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
