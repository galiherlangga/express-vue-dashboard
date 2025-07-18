const request = require('supertest');
const app = require('../src/app');

describe('Authentication Endpoints', () => {
    describe('Test Routes', () => {
        it('should return auth route test message', async () => {
            const response = await request(app).get('/api/auth/test').expect(200);
            expect(response.body).toHaveProperty('message', 'Auth route is working');
        })
    })
});