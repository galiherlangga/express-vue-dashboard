const { seedUsers, clearUsers } = require('./userSeeder');

/**
 * Main seeder runner
 * Orchestrates all seeding operations
 */
const runAllSeeders = async () => {
    try {
        console.log("🌱 Starting database seeding...");
        
        // Seed users
        await seedUsers(50);
        
        console.log("✅ All seeders completed successfully!");
        
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

/**
 * Clear all seeded data
 */
const clearAllSeeders = async () => {
    try {
        console.log("🧹 Clearing all seeded data...");
        
        // Clear users
        await clearUsers();
        
        console.log("✅ All data cleared successfully!");
        
    } catch (error) {
        console.error("❌ Clearing failed:", error);
        process.exit(1);
    }
};

// CLI execution
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'run':
            runAllSeeders();
            break;
            
        case 'clear':
            clearAllSeeders();
            break;
            
        default:
            console.log("Usage:");
            console.log("  node src/seeders/index.js run    - Run all seeders");
            console.log("  node src/seeders/index.js clear  - Clear all seeded data");
            process.exit(1);
    }
}

module.exports = {
    runAllSeeders,
    clearAllSeeders
};
