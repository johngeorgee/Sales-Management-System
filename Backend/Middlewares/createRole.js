// scripts/create-roles.js
const mongoose = require('mongoose');
const { roleModel } = require('../Models/role.model');
require('dotenv').config();

async function createRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-erp');
        console.log('Connected to MongoDB\n');

        // Define roles with permissions
        const roles = [
{
                name: 'Staff Manager',
                permissions: [
                    'read',
                    'write',
                    'manage_sales',
                    'manage_inventory'
                ]
            }
        ];

        // Clear existing roles (optional)
        // await roleModel.deleteMany({});
        // console.log('Cleared existing roles');

        // Create roles
        let createdCount = 0;
        for (const roleData of roles) {
            // Check if role already exists
            const existingRole = await roleModel.findOne({ name: roleData.name });
            if (!existingRole) {
                const role = await roleModel.create(roleData);
                console.log(`✅ Created role: ${role.name}`);
                createdCount++;
            } else {
                console.log(`⚠️ Role "${roleData.name}" already exists`);
            }
        }

        // Verify
        const allRoles = await roleModel.find();
        console.log(`\n📋 Total roles in database: ${allRoles.length}`);
        allRoles.forEach(role => {
            console.log(`  - ${role.name}: ${role.permissions.length} permissions`);
        });

        console.log(`\n✅ ${createdCount} new roles created successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createRoles();