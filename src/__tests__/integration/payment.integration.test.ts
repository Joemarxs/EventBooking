import request from 'supertest';
import app from '../../index'; 
import db from '../../drizzle/db';
import { payments } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Payments API Integration Tests', () => {
  let paymentId: number;

  const testPayment = {
    event_id: 1,
    user_id: 1,
    amount: 1500.75,
    paymentStatus: true,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'mpesa',
    transactionId: 'TEST-TXN-001'
  };

  afterAll(async () => {
    if (paymentId) {
      await db.delete(payments).where(eq(payments.payment_id, paymentId));
    }
  });

  test('POST /payments - should create a payment', async () => {
    const res = await request(app).post('/api/payments').send(testPayment);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('payment_id');
    expect(Number(res.body.amount)).toBe(testPayment.amount);
    paymentId = res.body.payment_id;
  });

  test('GET /payments - should return all payments', async () => {
    const res = await request(app).get('/api/payments');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((p: any) => p.payment_id === paymentId)).toBeDefined();
  });

  test('GET /payments/:id - should return the created payment', async () => {
    const res = await request(app).get(`/api/payments/${paymentId}`);

    expect(res.status).toBe(200);
    expect(res.body.payment_id).toBe(paymentId);
    expect(res.body.transactionId).toBe(testPayment.transactionId);
  });

  test('PUT /payments/:id - should update the payment', async () => {
    const updatedData = { amount: 2000.5 };

    const res = await request(app).put(`/api/payments/${paymentId}`).send(updatedData);

    expect(res.status).toBe(200);
    expect(Number(res.body.amount)).toBe(updatedData.amount);
  });

  test('DELETE /payments/:id - should delete the payment', async () => {
    const res = await request(app).delete(`/api/payments/${paymentId}`);

    expect(res.status).toBe(200);
    expect(res.body.payment_id).toBe(paymentId);
  });

  test('GET /payments/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/api/payments/${paymentId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Payment not found');
  });

  test('POST /payments - should fail with missing required fields', async () => {
    const res = await request(app).post('/api/payments').send({
      // Missing event_id, user_id, transactionId
      amount: 1000,
      paymentStatus: true,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'mpesa',
    });

    expect([400, 422]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('POST /payments - should fail with invalid enum value for paymentMethod', async () => {
    const res = await request(app).post('/api/payments').send({
      event_id: 1,
      user_id: 1,
      amount: 1000,
      paymentStatus: true,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cashapp', // Invalid enum
      transactionId: 'INVALID-ENUM-001',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid enum value for paymentMethod');
  });

  test('GET /payments/invalid - should return 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/payments/invalid-id');

    expect([400, 404]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('PUT /payments/invalid - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).put('/api/payments/invalid').send({ amount: 1234 });

    expect([400, 404]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('PUT /payments/999999 - should return 404 for non-existent payment', async () => {
    const res = await request(app).put('/api/payments/999999').send({ amount: 9999 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Payment not found');
  });

  test('DELETE /payments/invalid - should return 400 or 404 for invalid ID format', async () => {
    const res = await request(app).delete('/api/payments/invalid-id');

    expect([400, 404]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('DELETE /payments/999999 - should return 404 for non-existent payment', async () => {
    const res = await request(app).delete('/api/payments/999999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Payment not found or already deleted');
  });
});
