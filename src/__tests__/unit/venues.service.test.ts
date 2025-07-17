import * as venueService from '../../Venues/venue.service';
import db from '../../drizzle/db';

jest.mock('../../drizzle/db', () => ({
  insert: jest.fn(() => ({
    values: jest.fn(() => ({
      returning: jest.fn(() => Promise.resolve([{ venue_id: 1 }])),
    })),
  })),
  select: jest.fn(() => ({
    from: jest.fn(() => ({
      orderBy: jest.fn(() => Promise.resolve([{ venue_id: 1 }])),
      where: jest.fn(() => ({
        limit: jest.fn(() => Promise.resolve([{ venue_id: 1 }])),
      })),
    })),
  })),
  update: jest.fn(() => ({
    set: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve([{ venue_id: 1 }])),
      })),
    })),
  })),
  delete: jest.fn(() => ({
    where: jest.fn(() => ({
      returning: jest.fn(() => Promise.resolve([{ venue_id: 1 }])),
    })),
  })),
}));

describe('Venue Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createVenue should insert and return venue', async () => {
    const result = await venueService.createVenue({
      name: 'Test Venue',
      location: 'Nairobi',
      capacity: 1000,
    } as any);

    expect(result.venue_id).toBe(1);
  });

  test('getAllVenues should return venues list', async () => {
    const result = await venueService.getAllVenues();
    expect(result[0].venue_id).toBe(1);
  });

  test('getVenueById should return venue by id', async () => {
    const result = await venueService.getVenueById(1);
    expect(result?.venue_id).toBe(1);
  });

  test('updateVenue should return updated venue', async () => {
    const result = await venueService.updateVenue(1, { capacity: 1200 } as any);
    expect(result?.venue_id).toBe(1);
  });

  test('deleteVenue should return deleted venue', async () => {
    const result = await venueService.deleteVenue(1);
    expect(result?.venue_id).toBe(1);
  });
});
