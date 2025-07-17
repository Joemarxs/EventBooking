import db from '../drizzle/db';
import { customerSupport } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { TICustomerSupport } from '../drizzle/schema';

export const getAllSupportRequests = async () => {
  return await db.select().from(customerSupport);
};

export const getSupportRequestById = async (id: number) => {
  const [request] = await db
    .select()
    .from(customerSupport)
    .where(eq(customerSupport.support_id, id));
  return request ?? null;
};

export const createSupportRequest = async (data: TICustomerSupport) => {
  const { support_id, createdAt, updatedAt, ...safeData } = data;

  const [inserted] = await db
    .insert(customerSupport)
    .values({
      ...safeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return inserted;
};

export const updateSupportRequest = async (
  id: number,
  data: Partial<TICustomerSupport>
) => {
  const { support_id, createdAt, updatedAt, ...safeData } = data;

  const [updated] = await db
    .update(customerSupport)
    .set({
      ...safeData,
      updatedAt: new Date(),
    })
    .where(eq(customerSupport.support_id, id))
    .returning();

  return updated ?? null;
};

export const deleteSupportRequest = async (id: number) => {
  const [deleted] = await db
    .delete(customerSupport)
    .where(eq(customerSupport.support_id, id))
    .returning();

  return deleted ?? null;
};
