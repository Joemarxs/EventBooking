import db from '../drizzle/db';
import { venues } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { TIVenue } from '../drizzle/schema';

export const createVenue = async (data: TIVenue) => {
  const [inserted] = await db.insert(venues).values(data).returning();
  return inserted;
};

export const getAllVenues = async () => {
  return await db.select().from(venues).orderBy(venues.createdAt);
};

export const getVenueById = async (id: number) => {
  const [venue] = await db.select().from(venues).where(eq(venues.venue_id, id)).limit(1);
  return venue;
};

export const updateVenue = async (id: number, data: Partial<TIVenue>) => {
  const [updated] = await db.update(venues).set(data).where(eq(venues.venue_id, id)).returning();
  return updated;
};

export const deleteVenue = async (id: number) => {
  try {
    const [deleted] = await db
      .delete(venues)
      .where(eq(venues.venue_id, id))
      .returning();

    return deleted ?? null;
  } catch (error: any) {
    throw error;
  }
};
