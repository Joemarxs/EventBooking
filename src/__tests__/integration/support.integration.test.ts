import request from 'supertest';
import app from '../../index';

describe('Customer Support API Integration Tests', () => {
  let supportId: number;

  const supportData = {
    payment_id: 1,
    user_id: 1,
    subject: 'Problem with Payment',
    description: 'I was charged twice for the same event',
    status: 'open',
  };

  test('POST /api/support - should create a support request', async () => {
    const res = await request(app).post('/api/support').send(supportData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('support_id');
    expect(res.body.subject).toBe(supportData.subject);

    supportId = res.body.support_id;
  });

  test('GET /api/support - should get all support requests', async () => {
    const res = await request(app).get('/api/support');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/support/:id - should get support request by ID', async () => {
    const res = await request(app).get(`/api/support/${supportId}`);

    expect(res.status).toBe(200);
    expect(res.body.support_id).toBe(supportId);
  });

  test('PUT /api/support/:id - should update the support request', async () => {
    const updatedData = { status: 'pending' };
    const res = await request(app).put(`/api/support/${supportId}`).send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('pending');
  });

  test('DELETE /api/support/:id - should delete the support request', async () => {
    const res = await request(app).delete(`/api/support/${supportId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Support request deleted');
  });

  test('GET /api/support/:id - should return 404 for deleted request', async () => {
    const res = await request(app).get(`/api/support/${supportId}`);
    expect(res.status).toBe(404);
  });

  // 🚫 NEGATIVE TESTS BELOW

  test('POST /api/support - should fail with missing fields', async () => {
    const res = await request(app).post('/api/support').send({
      user_id: 1, // missing payment_id, subject, etc.
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  
  

  test('GET /api/support/99999 - should return 404 for non-existent request', async () => {
    const res = await request(app).get('/api/support/99999');

    expect(res.status).toBe(404);
  });

  test('PUT /api/support/99999 - should return 404 for non-existent request', async () => {
    const res = await request(app).put('/api/support/99999').send({ status: 'closed' });

    expect(res.status).toBe(404);
  });

  test('DELETE /api/support/99999 - should return 404 for non-existent request', async () => {
    const res = await request(app).delete('/api/support/99999');

    expect(res.status).toBe(404);
  });

  test('POST /api/support - should fail with invalid enum status', async () => {
  const res = await request(app).post('/api/support').send({
    payment_id: 1,
    user_id: 1,
    subject: 'Problem with Payment',
    description: 'I was charged twice for the same event',
    status: 'invalid_status', // invalid
  });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Invalid enum value for status');
});



  test('GET /api/support/invalid - should return 400 for invalid ID type', async () => {
    const res = await request(app).get('/api/support/invalid');

    expect([400, 404]).toContain(res.status); 
  });
});
