import request from 'supertest';
import app from '../index';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(app).get('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/9999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Charlie Brown',
        email: 'charlie@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newUser.name);
      expect(response.body).toHaveProperty('email', newUser.email);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const updatedData = {
        name: 'Alice Updated',
        email: 'alice.updated@example.com'
      };

      const response = await request(app)
        .put('/api/users/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty('email', updatedData.email);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/9999')
        .send({ name: 'Test', email: 'test@example.com' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const response = await request(app).delete('/api/users/2');

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).delete('/api/users/9999');

      expect(response.status).toBe(404);
    });
  });
});
