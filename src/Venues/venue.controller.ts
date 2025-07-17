import { Request, Response } from 'express';
import {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} from './venue.service';

export const handleCreateVenue = async (req: Request, res: Response) => {
  const { name, address, capacity } = req.body;

  if (!name || !address || typeof capacity !== 'number' || capacity <= 0) {
    return res.status(422).json({
      error: 'Missing or invalid fields. Ensure name, address, and positive capacity are provided.',
    });
  }

  try {
    const newVenue = await createVenue(req.body);
    res.status(201).json(newVenue);
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ error: 'Failed to create venue' });
  }
};

export const handleGetAllVenues = async (_: Request, res: Response) => {
  try {
    const venues = await getAllVenues();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
};

export const handleGetVenueById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid venue ID' });

  try {
    const venue = await getVenueById(id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
};

export const handleUpdateVenue = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid venue ID' });

  try {
    const updated = await updateVenue(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Venue not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update venue' });
  }
};

export const handleDeleteVenue = async (req: Request, res: Response) => {
  const venueId = Number(req.params.id);
  if (isNaN(venueId)) {
    return res.status(400).json({ error: 'Invalid venue ID' });
  }

  try {
    const deleted = await deleteVenue(venueId);
    if (!deleted) {
      return res.status(404).json({ error: 'Venue not found or already deleted' });
    }

    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error: any) {
    const pgErrorCode = error?.cause?.code || error.code;

    if (pgErrorCode === '23503') {
      return res.status(409).json({
        error: 'Cannot delete venue: It is still linked to existing events.',
      });
    }

    console.error('Error deleting venue:', error);
    res.status(500).json({ error: 'Failed to delete venue' });
  }
};
