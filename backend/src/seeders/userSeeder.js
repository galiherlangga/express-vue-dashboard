const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

/**
 * Database seeder for users
 * Creates random users + 1 admin user
 */

// Sample data for generating random users
const firstNames = [
    "John", "Jane", "Michael", "Sarah", "David", "Emma", "James", "Lisa",
    "Robert", "Mary", "William", "Jennifer", "Richard", "Patricia", "Charles",
    "Linda", "Thomas", "Elizabeth", "Christopher", "Barbara", "Daniel", "Susan",
    "Matthew", "Jessica", "Anthony", "Karen", "Mark", "Nancy", "Donald", "Lisa",
    "Steven", "Betty", "Paul", "Helen", "Andrew", "Sandra", "Joshua", "Donna",
    "Kenneth", "Carol", "Kevin", "Ruth", "Brian", "Sharon", "George", "Michelle",
    "Edward", "Laura", "Ronald", "Sarah", "Timothy", "Kimberly", "Jason", "Deborah",
    "Jeffrey", "Dorothy", "Ryan", "Amy", "Jacob", "Angela", "Gary", "Brenda",
    "Nicholas", "Emma", "Eric", "Olivia", "Jonathan", "Cynthia", "Stephen", "Marie"
];

const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
    "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
    "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
    "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson"
];

const domains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
    "icloud.com", "protonmail.com", "company.com", "business.org", "tech.io"
];

/**
 * Generate random user data
 * @returns {Object} User data object
 */
const generateRandomUser = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    // Generate email with random number to avoid duplicates
    const randomNum = Math.floor(Math.random() * 1000);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
    
    return {
        name: `${firstName} ${lastName}`,
        email: email,
        password: "password123", // This will be hashed by the User model
        role: "user",
        isActive: Math.random() > 0.1, // 90% chance of being active
        lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null // 70% chance of having logged in within last 30 days
    };
};

/**
 * Create admin user
 * @returns {Object} Admin user data
 */
const createAdminUser = () => {
    return {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        isActive: true,
        lastLogin: new Date()
    };
};

/**
 * Get MongoDB URI with proper fallback
 * @returns {string} MongoDB connection string
 */
const getMongoURI = () => {
    // Check if MONGODB_URI is set and valid
    if (process.env.MONGODB_URI) {
        let uri = process.env.MONGODB_URI.trim();
        
        // If it's a valid URI, return it
        if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
            return uri;
        }
    }
    
    // Fallback to local MongoDB
    return "mongodb://localhost:27017/express_db";
};

/**
 * Seed users to database
 * @param {number} count - Number of random users to create (default: 50)
 */
const seedUsers = async (count = 50) => {
    let connection = null;
    
    try {
        console.log("🌱 Starting user seeding process...");
        
        // Get proper MongoDB URI
        const mongoURI = getMongoURI();
        console.log(`📡 Connecting to: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')}`);
        
        // Connect to database
        connection = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        // Clear existing users
        const existingCount = await User.countDocuments();
        if (existingCount > 0) {
            console.log(`🗑️  Clearing ${existingCount} existing users...`);
            await User.deleteMany({});
            console.log("✅ Existing users cleared");
        }

        // Create admin user
        console.log("👑 Creating admin user...");
        const adminUser = createAdminUser();
        const createdAdmin = await User.create(adminUser);
        console.log(`✅ Admin user created: ${createdAdmin.email}`);

        // Generate and create random users
        console.log(`👥 Creating ${count} random users...`);
        const users = [];
        
        for (let i = 0; i < count; i++) {
            const userData = generateRandomUser();
            users.push(userData);
        }

        // Batch insert users
        const createdUsers = await User.insertMany(users);
        console.log(`✅ ${createdUsers.length} random users created`);

        // Display summary
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const adminUsers = await User.countDocuments({ role: "admin" });
        const regularUsers = await User.countDocuments({ role: "user" });

        console.log("\n📊 Seeding Summary:");
        console.log(`   Total users: ${totalUsers}`);
        console.log(`   Active users: ${activeUsers}`);
        console.log(`   Admin users: ${adminUsers}`);
        console.log(`   Regular users: ${regularUsers}`);
        console.log(`   Inactive users: ${totalUsers - activeUsers}`);
        
        console.log("\n🔐 Admin Credentials:");
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: ${adminUser.password}`);
        
        console.log("\n🎉 User seeding completed successfully!");
        
    } catch (error) {
        console.error("❌ Error during user seeding:", error);
        
        // More specific error handling
        if (error.message.includes("database names cannot contain")) {
            console.error("💡 Tip: Check your MONGODB_URI environment variable for invalid characters");
            console.error("💡 Example: MONGODB_URI=mongodb://localhost:27017/express_db");
        }
        
        throw error;
    } finally {
        // Close database connection
        if (connection && mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("🔌 Database connection closed");
        }
    }
};

/**
 * Clear all users from database
 */
const clearUsers = async () => {
    let connection = null;
    
    try {
        console.log("🧹 Clearing all users from database...");
        
        const mongoURI = getMongoURI();
        console.log(`📡 Connecting to: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')}`);
        
        connection = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        const deletedCount = await User.deleteMany({});
        console.log(`✅ Deleted ${deletedCount.deletedCount} users`);
        
    } catch (error) {
        console.error("❌ Error clearing users:", error);
        throw error;
    } finally {
        if (connection && mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("🔌 Database connection closed");
        }
    }
};

// Export functions
module.exports = {
    seedUsers,
    clearUsers,
    generateRandomUser,
    createAdminUser,
    getMongoURI
};

// CLI execution
if (require.main === module) {
    const command = process.argv[2];
    const count = parseInt(process.argv[3]) || 50;
    
    switch (command) {
        case 'seed':
            seedUsers(count)
                .then(() => process.exit(0))
                .catch((error) => {
                    console.error(error);
                    process.exit(1);
                });
            break;
            
        case 'clear':
            clearUsers()
                .then(() => process.exit(0))
                .catch((error) => {
                    console.error(error);
                    process.exit(1);
                });
            break;
            
        default:
            console.log("Usage:");
            console.log("  node src/seeders/userSeeder.js seed [count]  - Seed users (default: 50)");
            console.log("  node src/seeders/userSeeder.js clear         - Clear all users");
            console.log("\nExamples:");
            console.log("  node src/seeders/userSeeder.js seed 100      - Create 100 random users + 1 admin");
            console.log("  node src/seeders/userSeeder.js clear         - Remove all users");
            console.log("\nEnvironment:");
            console.log(`  MONGODB_URI: ${process.env.MONGODB_URI || 'Not set (will use localhost)'}`);
            process.exit(1);
    }
}
