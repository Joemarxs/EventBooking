import { payments } from '../drizzle/schema';
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';
import type { TIPayment } from '../drizzle/schema';

export const getAllPayments = async () => {
  return await db.select().from(payments);
};

export const getPaymentById = async (id: number) => {
  const [payment] = await db.select().from(payments).where(eq(payments.payment_id, id));
  return payment ?? null;
};

export const createPayment = async (data: TIPayment) => {
  if (!data) throw new Error('No payment data provided');

  const {
    payment_id,
    createdAt,
    updatedAt,
    ...safeData
  } = data;

  const [inserted] = await db.insert(payments).values({
    ...safeData,
    createdAt: new Date(createdAt ?? Date.now()),
    updatedAt: new Date(updatedAt ?? Date.now())
  }).returning();

  return inserted;
};

export const updatePayment = async (id: number, data: Partial<TIPayment>) => {
  const {
    payment_id,
    createdAt,
    updatedAt,
    ...safeData
  } = data;

  const [updated] = await db.update(payments)
    .set({
      ...safeData,
      updatedAt: new Date()
    })
    .where(eq(payments.payment_id, id))
    .returning();

  return updated ?? null;
};

export const deletePayment = async (id: number) => {
  const [deleted] = await db.delete(payments)
    .where(eq(payments.payment_id, id))
    .returning();

  return deleted ?? null;
};
