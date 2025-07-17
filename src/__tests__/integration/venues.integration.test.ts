import request from 'supertest';
import app from '../../index';

describe('Venue API Integration Tests', () => {
  let venueId: number;

  const venueData = {
    name: 'Test Venue',
    address: '123 Test Street',
    capacity: 300
  };

  test('POST /api/venues - should create a venue', async () => {
    const res = await request(app).post('/api/venues').send(venueData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('venue_id');
    expect(res.body.name).toBe(venueData.name);
    venueId = res.body.venue_id;
  });

  test('GET /api/venues - should get all venues', async () => {
    const res = await request(app).get('/api/venues');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/venues/:id - should get venue by ID', async () => {
    const res = await request(app).get(`/api/venues/${venueId}`);

    expect(res.status).toBe(200);
    expect(res.body.venue_id).toBe(venueId);
    expect(res.body.name).toBe(venueData.name);
  });

  test('PUT /api/venues/:id - should update the venue', async () => {
    const res = await request(app)
      .put(`/api/venues/${venueId}`)
      .send({ name: 'Updated Venue Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Venue Name');
  });

  test('DELETE /api/venues/:id - should delete the venue', async () => {
    const res = await request(app).delete(`/api/venues/${venueId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Venue deleted successfully');
  });

  test('GET /api/venues/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/api/venues/${venueId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Venue not found');
  });

  // ---------- Negative Tests Below ----------

  test('POST /api/venues - should fail with missing fields', async () => {
    const res = await request(app).post('/api/venues').send({
      name: '',
      address: '',
      capacity: null
    });

    expect([400, 422]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('GET /api/venues/invalid - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).get('/api/venues/invalid');
    expect([400, 404]).toContain(res.status);
  });

  test('PUT /api/venues/:id - should return 404 for non-existent venue', async () => {
    const res = await request(app).put('/api/venues/999999').send({ name: 'Non-existent Venue' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Venue not found');
  });

  test('DELETE /api/venues/:id - should return 404 for non-existent venue', async () => {
    const res = await request(app).delete('/api/venues/999999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Venue not found or already deleted');
  });
});
