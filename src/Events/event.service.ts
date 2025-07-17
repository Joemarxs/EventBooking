import db from '../drizzle/db';
import { eq } from 'drizzle-orm';
import type { TIEvent } from '../drizzle/schema';
import { events } from '../drizzle/schema';


export const getAllEvents = async () => {
  return await db.select().from(events);
};

export const getEventById = async (id: number) => {
  const [event] = await db.select().from(events).where(eq(events.event_id, id));
  return event ?? null;
};

export const createEvent = async (data: TIEvent) => {
  if (!data) {
    throw new Error("No event data provided");
  }

  const {
    event_id, // unused, strip it out to avoid manual insertion
    createdAt,
    updatedAt,
    ...safeData
  } = data;

  const [inserted] = await db.insert(events).values({
    ...safeData,
    createdAt: new Date(createdAt ?? Date.now()),
    updatedAt: new Date(updatedAt ?? Date.now()),
  }).returning();

  return inserted;
};


export const updateEvent = async (id: number, data: Partial<TIEvent>) => {
  const { event_id, createdAt, updatedAt, ...safeData } = data;

  const [updated] = await db.update(events)
    .set({
      ...safeData,
      updatedAt: new Date(),
    })
    .where(eq(events.event_id, id))
    .returning();

  return updated ?? null;
};

export const deleteEvent = async (id: number) => {
  const [deleted] = await db.delete(events)
    .where(eq(events.event_id, id))
    .returning();

  return deleted ?? null;
};
