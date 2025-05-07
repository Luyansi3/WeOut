import request from 'supertest';
import express, { Express } from 'express';
import router from '../src/routes';

const app: Express = express();
app.use(express.json());
app.use('/api', router);

describe('GET /api/users', () => {
  it('should return an array of users (mocked)', async () => {
    // Optional: mock Prisma if needed
    const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
