import request from 'supertest';
import app from '../../index';

describe('User API Integration Tests', () => {
  let userId: number;
  const userData = {
    email: 'testing170user@example.com',
    password: '12345678',
    first_name: 'Test',
    last_name: 'User',
  };

  test('POST /api/users - should create a user', async () => {
    const res = await request(app).post('/api/users').send(userData);

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('user_id');
    expect(res.body.token).toBeDefined();
    userId = res.body.user.user_id;
  });

  test('POST /api/users - should fail with missing fields', async () => {
    const res = await request(app).post('/api/users').send({
      email: 'incomplete@example.com',
      password: '12345678',
    });

    expect([400, 422]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/users/login - should log in a user', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
  });

  test('POST /api/users/login - should fail with wrong password', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: userData.email,
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/users/login - should fail with unknown email', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'nonexistent@example.com',
      password: '12345678',
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  test('GET /api/users - should return list of users', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/:id - should return user by ID', async () => {
    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe(userId);
  });

  test('GET /api/users/invalid-id - should fail with 400', async () => {
    const res = await request(app).get('/api/users/invalid-id');

    expect([400, 404]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('PUT /api/users/:id - should update user info', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ firstName: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ firstName: 'Updated' });
  });

  test('PUT /api/users/invalid-id - should fail with 400', async () => {
    const res = await request(app)
      .put('/api/users/invalid-id')
      .send({ firstName: 'BadUpdate' });

    expect([400, 404]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('PUT /api/users/999999 - should return 404', async () => {
    const res = await request(app)
      .put('/api/users/999999')
      .send({ firstName: 'Ghost' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('DELETE /api/users/:id - should delete the user', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  test('GET /api/users/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(404);
  });

  test('DELETE /api/users/invalid-id - should return 400 or 404', async () => {
    const res = await request(app).delete('/api/users/invalid-id');

    expect([400, 404]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });

  test('DELETE /api/users/999999 - should return 404', async () => {
    const res = await request(app).delete('/api/users/999999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
