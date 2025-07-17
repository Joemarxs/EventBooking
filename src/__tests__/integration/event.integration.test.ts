import request from 'supertest';
import app from '../../index';

describe('Event API Integration Tests', () => {
  let eventId: number;

  const testEvent = {
    title: 'Test Event',
    description: 'A test event description',
    date: '2025-12-01T10:00:00.000Z',
    location: 'Test Venue'
  };

  test('POST /api/events - should create an event', async () => {
    const res = await request(app).post('/api/events').send(testEvent);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('event_id');
    expect(res.body.title).toBe(testEvent.title);

    eventId = res.body.event_id;
  });

  test('GET /api/events - should return all events', async () => {
    const res = await request(app).get('/api/events');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/events/:id - should return the created event', async () => {
    const res = await request(app).get(`/api/events/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body.event_id).toBe(eventId);
    expect(res.body.title).toBe(testEvent.title);
  });

  test('PUT /api/events/:id - should update the event', async () => {
    const updatedData = { title: 'Updated Event Title' };
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  test('DELETE /api/events/:id - should delete the event', async () => {
    const res = await request(app).delete(`/api/events/${eventId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Event deleted successfully');
  });

  test('GET /api/events/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/api/events/${eventId}`);
    expect(res.status).toBe(404);
  });


  test('POST /api/events - should fail with missing required fields (400 or 422)', async () => {
  const res = await request(app).post('/api/events').send({
    // Missing title and date
    description: 'Missing title and date',
    location: 'Nairobi'
  });

  expect([400, 422]).toContain(res.status);       
  expect(res.body.error).toBeDefined();          
});


  test('POST /api/events - should fail with invalid date format', async () => {
    const res = await request(app).post('/api/events').send({
      title: 'Bad Date Event',
      description: 'Event with bad date',
      date: 'not-a-date',
      location: 'Mars'
    });

    expect([400, 422]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('GET /api/events/invalid-id - should return 400 or 404', async () => {
    const res = await request(app).get('/api/events/invalid-id');
    expect([400, 404]).toContain(res.status);
  });

  test('GET /api/events/999999 - should return 404 for non-existent event', async () => {
    const res = await request(app).get('/api/events/999999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Event not found');
  });

  test('PUT /api/events/invalid-id - should return 400 or 404', async () => {
    const res = await request(app).put('/api/events/invalid-id').send({ title: 'Fail' });
    expect([400, 404]).toContain(res.status);
  });

  test('PUT /api/events/999999 - should return 404 for non-existent event', async () => {
    const res = await request(app).put('/api/events/999999').send({ title: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Event not found');
  });

  test('DELETE /api/events/invalid-id - should return 400 or 404', async () => {
    const res = await request(app).delete('/api/events/invalid-id');
    expect([400, 404]).toContain(res.status);
  });

  test('DELETE /api/events/999999 - should return 404 for non-existent event', async () => {
    const res = await request(app).delete('/api/events/999999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Event not found or already deleted');
  });
});
