import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../backend/src/app.module';

describe('KONIVRER API Integration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('API Specification Compliance', () => {
    it('/api/cards (GET) should follow specification format', () => {
      return request(app.getHttpServer())
        .get('/api/cards?q=test&page=1&pageSize=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('pageSize');
          expect(res.body).toHaveProperty('cards');
          expect(Array.isArray(res.body.cards)).toBe(true);
        });
    });

    it('/api/auth/register (POST) should follow specification format', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'P@ssw0rd123',
          username: 'testuser',
        })
        .expect((res) => {
          if (res.status === 201) {
            expect(res.body).toHaveProperty('userId');
            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('username');
          } else if (res.status === 409) {
            // User already exists - acceptable for testing
            expect(res.body).toHaveProperty('code');
            expect(res.body).toHaveProperty('message');
          }
        });
    });

    it('Error responses should follow standard format', () => {
      return request(app.getHttpServer())
        .get('/api/cards/invalid-uuid')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('code');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('method');
        });
    });
  });

  describe('Provenance Headers', () => {
    it('should accept provenance headers', () => {
      return request(app.getHttpServer())
        .get('/api/cards')
        .set('X-Provenance-Agent-Id', 'test-agent')
        .set('X-Provenance-Model-Version', 'v1.0')
        .set('X-Provenance-Prompt-Hash', 'abc123')
        .expect(200);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      // Make multiple rapid requests to test rate limiting
      const promises = Array(150).fill(0).map(() =>
        request(app.getHttpServer()).get('/api/cards')
      );

      const results = await Promise.all(promises.map(p => 
        p.catch(err => ({ status: err.status }))
      ));

      // Should have some rate limited responses
      const rateLimited = results.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    }, 10000);
  });
});