import request from 'supertest';
import app from '../../src/index';

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('services');
  });

  it('should include service status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.services).toHaveProperty('github_api');
    expect(response.body.services).toHaveProperty('aws');
    expect(response.body.services).toHaveProperty('database');
  });
});