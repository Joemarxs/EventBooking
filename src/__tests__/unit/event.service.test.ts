import * as eventService from '../../Events/event.service';
import { events } from '../../drizzle/schema';
import db from '../../drizzle/db';
import { eq } from 'drizzle-orm';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn(() => ({
      where: jest.fn(() => Promise.resolve([{ event_id: 1, title: 'Sample Event' }])),
    })),
  })),
  insert: jest.fn(() => ({
    values: jest.fn(() => ({
      returning: jest.fn(() =>
        Promise.resolve([{ event_id: 1, title: 'New Event' }])
      ),
    })),
  })),
  update: jest.fn(() => ({
    set: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: jest.fn(() =>
          Promise.resolve([{ event_id: 1, title: 'Updated Event' }])
        ),
      })),
    })),
  })),
  delete: jest.fn(() => ({
    where: jest.fn(() => ({
      returning: jest.fn(() =>
        Promise.resolve([{ event_id: 1, title: 'Deleted Event' }])
      ),
    })),
  })),
}));

describe('Event Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllEvents should return list of events', async () => {
  (db.select as any).mockReturnValueOnce({
    from: () => Promise.resolve([
      { event_id: 1, title: 'Sample Event' },
    ]),
  });

  const allEvents = await eventService.getAllEvents();
  expect(allEvents[0].event_id).toBe(1);
});


  test('getEventById should return single event', async () => {
    const event = await eventService.getEventById(1);
    expect(event?.event_id).toBe(1);
  });

  test('createEvent should insert and return event', async () => {
    const newEvent = await eventService.createEvent({
      title: 'New Event',
      category: 'Music',
      date: new Date('2025-12-01'),
      time: '18:00',
      ticketPrice: 100.0,
      ticketsTotal: 500,
      ticketSold: 0,
      venue_id: 1,
    } as any);
    expect(newEvent.title).toBe('New Event');
  });

  test('updateEvent should return updated event', async () => {
    const updated = await eventService.updateEvent(1, {
      title: 'Updated Event',
    });
    expect(updated?.title).toBe('Updated Event');
  });

  test('deleteEvent should return deleted event', async () => {
    const deleted = await eventService.deleteEvent(1);
    expect(deleted?.title).toBe('Deleted Event');
  });

  test('createEvent should throw if data is missing', async () => {
    await expect(eventService.createEvent(undefined as any)).rejects.toThrow(
      'No event data provided'
    );
  });
});
