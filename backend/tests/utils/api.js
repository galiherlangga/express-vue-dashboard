const request = require('supertest');
const app = require('../../src/appapp');

class APITester {
    constructor() {
        this.agent = request(app);
        this.authToken = null;
    }
    
    setAuthToken(token) {
        this.authToken = token;
        return this;
    }
    
    get(url) {
        const req = this.agent.get(url);
        if (this.authToken) {
            req.set('Authorization', `Bearer ${this.authToken}`);
        }
        return req;
    }
    
    post(url, data = {}) {
        const req = this.agent.post(url).send(data);
        if (this.authToken) {
            req.set('Authorization', `Bearer ${this.authToken}`);
        }
        return req;
    }
    
    put(url, data = {}) {
        const req = this.agent.put(url).send(data);
        if (this.authToken) {
            req.set('Authorization', `Bearer ${this.authToken}`);
        }
        return req;
    }
    
    delete(url) {
        const req = this.agent.delete(url);
        if (this.authToken) {
            req.set('Authorization', `Bearer ${this.authToken}`);
        }
        return req;
    }
}

module.exports = { APITester };