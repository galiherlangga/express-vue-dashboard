const request = require('supertest');
const app = require('../src/app');

describe('Health Endpoint', () => {
    describe('GET /api/health', () => {
        it('should return server status', async () => {
            const response = await request(app).get('/api/health').expect(200);
            
            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('message', 'API is running smoothly');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('environment');
        });
        
        it('should include correct environment', async () => {
            const response = await request(app).get('/api/health').expect(200);
            
            expect(response.body.environment).toBe('test');
        });
    });
});