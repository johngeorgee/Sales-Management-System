// controllers/customer.controller.js
const customerService = require("../services/customer.service");

// ================= GET ALL CUSTOMERS =================
const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await customerService.getCustomers(page, limit);

        res.status(200).json({
            message: "Customers fetched successfully",
            data: result.customers,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ================= GET CUSTOMER BY ID =================
const getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);

        res.status(200).json({
            message: "Customer fetched successfully",
            data: customer
        });
    } catch (error) {
        if (error.message === "Invalid customer ID") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Customer not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// ================= CREATE CUSTOMER =================
const createCustomer = async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);

        res.status(201).json({
            message: "Customer created successfully",
            data: customer
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// ================= UPDATE CUSTOMER =================
const updateCustomer = async (req, res) => {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.body);

        res.status(200).json({
            message: "Customer updated successfully",
            data: customer
        });
    } catch (error) {
        if (error.message === "Invalid customer ID") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Customer not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// ================= DELETE CUSTOMER =================
const deleteCustomer = async (req, res) => {
    try {
        const result = await customerService.deleteCustomer(req.params.id);

        res.status(200).json({
            message: result.message,
            data: result.data
        });
    } catch (error) {
        if (error.message === "Invalid customer ID") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Customer not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};