import { Request, Response } from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from './payment.service';

// Sync with your enum in schema or DB
const VALID_PAYMENT_METHODS = ['mpesa', 'card', 'paypal'];

const respondWithError = (res: Response, status: number, message: string) => {
  return res.status(status).json({ error: message });
};

// Optional helper to check for required fields
const validateRequiredFields = (body: any, fields: string[]): string | null => {
  const missing = fields.filter(field => body[field] === undefined || body[field] === null);
  return missing.length ? `Missing required fields: ${missing.join(', ')}` : null;
};

export const handleGetPayments = async (_: Request, res: Response) => {
  try {
    const payments = await getAllPayments();
    return res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return respondWithError(res, 500, 'Failed to fetch payments');
  }
};

export const handleGetPayment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return respondWithError(res, 400, 'Invalid payment ID');
  }

  try {
    const payment = await getPaymentById(id);
    if (!payment) return respondWithError(res, 404, 'Payment not found');
    return res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return respondWithError(res, 500, 'Failed to fetch payment');
  }
};

export const handleCreatePayment = async (req: Request, res: Response) => {
  const {
    event_id,
    user_id,
    amount,
    paymentStatus,
    paymentDate,
    paymentMethod,
    transactionId
  } = req.body;

  const missing = validateRequiredFields(req.body, [
    'event_id',
    'user_id',
    'amount',
    'paymentStatus',
    'paymentDate',
    'paymentMethod',
    'transactionId'
  ]);
  if (missing) {
    return respondWithError(res, 400, missing);
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return respondWithError(res, 400, 'Invalid enum value for paymentMethod');
  }

  try {
    const newPayment = await createPayment(req.body);
    return res.status(201).json(newPayment);
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return respondWithError(res, 400, error?.message || 'Failed to create payment');
  }
};

export const handleUpdatePayment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return respondWithError(res, 400, 'Invalid payment ID');
  }

  const { paymentMethod } = req.body;
  if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return respondWithError(res, 400, 'Invalid enum value for paymentMethod');
  }

  try {
    const updated = await updatePayment(id, req.body);
    if (!updated) return respondWithError(res, 404, 'Payment not found');
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return respondWithError(res, 400, error?.message || 'Failed to update payment');
  }
};

export const handleDeletePayment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return respondWithError(res, 400, 'Invalid payment ID');
  }

  try {
    const deleted = await deletePayment(id);
    if (!deleted) {
      return respondWithError(res, 404, 'Payment not found or already deleted');
    }

    return res.status(200).json(deleted);
  } catch (error: any) {
    const pgErrorCode = error?.cause?.code || error.code;

    if (pgErrorCode === '23503') {
      return respondWithError(res, 409, 'Cannot delete payment: It is linked to other records.');
    }

    console.error('Error deleting payment:', error);
    return respondWithError(res, 500, 'Failed to delete payment');
  }
};
