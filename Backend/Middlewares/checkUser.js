// scripts/check-users.js
const mongoose = require('mongoose');
const { userModel } = require('../Models/users.model');
const { roleModel } = require('../Models/role.model');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-erp');
        console.log('Connected to MongoDB\n');

        // Get all users with role
        const users = await userModel.find().populate('roleId');
        
        console.log(`Total users: ${users.length}\n`);
        
        users.forEach((user, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  ID: ${user._id}`);
            console.log(`  Username: ${user.username}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  roleId: ${user.roleId}`);
            console.log(`  Role Name: ${user.roleId?.name || 'NO ROLE ASSIGNED'}`);
            console.log('---');
        });

        // Check if roles exist
        const roles = await roleModel.find();
        console.log(`\nTotal roles: ${roles.length}`);
        roles.forEach(role => {
            console.log(`  Role: ${role.name} (ID: ${role._id})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();