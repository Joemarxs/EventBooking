import { Request, Response } from 'express';
import {
  getAllSupportRequests,
  getSupportRequestById,
  createSupportRequest,
  updateSupportRequest,
  deleteSupportRequest,
} from './customerSupport.service';

export const handleGetSupportRequests = async (_: Request, res: Response) => {
  try {
    const data = await getAllSupportRequests();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch support requests' });
  }
};

export const handleGetSupportRequest = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const data = await getSupportRequestById(id);
    if (!data) return res.status(404).json({ error: 'Support request not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch support request' });
  }
};

export const handleCreateSupportRequest = async (req: Request, res: Response) => {
  const { payment_id, user_id, subject, description, status } = req.body;

  if (!payment_id || !user_id || !subject || !description || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newRequest = await createSupportRequest(req.body);
    res.status(201).json(newRequest);
  } catch (error: any) {
    const pgCode = error?.cause?.code || error.code;
    if (pgCode === '22P02') {
      return res.status(400).json({ error: 'Invalid enum value for status' });
    }

    console.error('Error creating support request:', error);
    res.status(400).json({ error: error.message || 'Failed to create support request' });
  }
};

export const handleUpdateSupportRequest = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const updated = await updateSupportRequest(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Support request not found' });
    res.status(200).json(updated);
  } catch (error: any) {
    const pgCode = error?.cause?.code || error.code;
    if (pgCode === '22P02') {
      return res.status(400).json({ error: 'Invalid enum value for status' });
    }

    res.status(400).json({ error: error.message || 'Failed to update support request' });
  }
};

export const handleDeleteSupportRequest = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const deleted = await deleteSupportRequest(id);
    if (!deleted) return res.status(404).json({ error: 'Support request not found' });
    res.status(200).json({ message: 'Support request deleted', deleted });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message || 'Failed to delete support request' });
  }
};
