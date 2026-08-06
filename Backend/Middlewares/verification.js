// scripts/verify-database.js
const mongoose = require('mongoose');
const { userModel } = require('../Models/users.model');
const { roleModel } = require('../Models/role.model');
require('dotenv').config();

async function verifyDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-erp');
        console.log('Connected to MongoDB\n');

        // Check roles
        const roles = await roleModel.find();
        console.log(`📋 Roles (${roles.length}):`);
        roles.forEach(role => {
            console.log(`  - ${role.name}: ${role.permissions.join(', ')}`);
        });
        console.log('');

        // Check users
        const users = await userModel.find().populate('roleId');
        console.log(`📋 Users (${users.length}):`);
        users.forEach(user => {
            console.log(`  - ${user.email} (${user.username})`);
            console.log(`    Role: ${user.roleId?.name || 'NO ROLE'}`);
            console.log(`    Permissions: ${user.roleId?.permissions?.join(', ') || 'None'}`);
            console.log(`    Active: ${user.isActive}`);
            console.log('  ---');
        });

        console.log('\n✅ Database verification complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyDatabase();