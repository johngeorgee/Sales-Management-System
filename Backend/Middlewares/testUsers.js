// scripts/create-test-users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { userModel } = require('../Models/users.model');
const { roleModel } = require('../Models/role.model');
require('dotenv').config();

async function createTestUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-erp');
        console.log('Connected to MongoDB\n');

        // Get all roles
        const adminRole = await roleModel.findOne({ name: 'Admin' });
        const managerRole = await roleModel.findOne({ name: 'Manager' });
        const staffRole = await roleModel.findOne({ name: 'Staff' });

        if (!adminRole || !managerRole || !staffRole) {
            console.log('❌ Roles not found. Please run create-roles.js first.');
            process.exit(1);
        }

        console.log('✅ Found roles:');
        console.log(`  Admin: ${adminRole.name}`);
        console.log(`  Manager: ${managerRole.name}`);
        console.log(`  Staff: ${staffRole.name}`);

        // Define test users
        const testUsers = [
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'john123',
                phoneNumber: 1234567890,
                gender: 'male',
                age: 28,
                roleId: managerRole._id,
                isActive: true
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                password: 'jane123',
                phoneNumber: 9876543210,
                gender: 'female',
                age: 25,
                roleId: staffRole._id,
                isActive: true
            },
            {
                username: 'bob_wilson',
                email: 'bob@example.com',
                password: 'bob123',
                phoneNumber: 5555555555,
                gender: 'male',
                age: 35,
                roleId: staffRole._id,
                isActive: true
            }
        ];

        let createdCount = 0;
        for (const userData of testUsers) {
            // Check if user already exists
            const existingUser = await userModel.findOne({ email: userData.email });
            
            if (existingUser) {
                console.log(`⚠️ User ${userData.email} already exists, updating role...`);
                existingUser.roleId = userData.roleId;
                existingUser.isActive = true;
                await existingUser.save();
                console.log(`✅ Updated ${userData.email}`);
            } else {
                // Hash password
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashedPassword;
                
                // Create user
                const user = await userModel.create(userData);
                console.log(`✅ Created user: ${user.email} (${userData.roleId === managerRole._id ? 'Manager' : 'Staff'})`);
                createdCount++;
            }
        }

        // Verify all users
        const allUsers = await userModel.find().populate('roleId');
        console.log(`\n📋 Total users in database: ${allUsers.length}`);
        allUsers.forEach(user => {
            console.log(`  - ${user.email} (${user.username}) -> Role: ${user.roleId?.name || 'NO ROLE'}`);
        });

        console.log(`\n✅ ${createdCount} new users created successfully!`);
        console.log('\n🔑 Test login credentials:');
        console.log('  Admin: admin@example.com / admin123');
        console.log('  Manager: john@example.com / john123');
        console.log('  Staff: jane@example.com / jane123');
        console.log('  Staff: bob@example.com / bob123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createTestUsers();