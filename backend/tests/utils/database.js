const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectTestDB = async () => {
    try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Connected to test database:', mongoUri);
    } catch (error) {
        console.error('Error connecting to test database:', error);
        throw error;
    }
}

const disconnectTestDB = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
        }
        console.log('Disconnected from test database');
    } catch (error) {
        console.error('Error disconnecting from test database:', error);
    }
};

const clearTestDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

module.exports = {
    connectTestDB,
    disconnectTestDB,
    clearTestDB,
};