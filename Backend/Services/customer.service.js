// services/customer.service.js
const { Customer } = require("../Models/customer.model");
const mongoose = require("mongoose");

// ================= CREATE CUSTOMER =================
const createCustomer = async (data) => {
    const customer = await Customer.create(data);
    return customer;
};

// ================= GET ALL CUSTOMERS WITH PAGINATION =================
const getCustomers = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const customers = await Customer.aggregate([
        {
            $lookup: {
                from: "customer_locations",
                localField: "_id",
                foreignField: "customerRef",
                as: "location"
            }
        },
        {
            $unwind: {
                path: "$location",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                Customer_Id: 1,
                Customer_FullName: 1,
                Customer_Segment: 1,
                "location.Customer_City": 1,
                "location.Customer_State": 1,
                "location.Customer_Country": 1,
                "location.Customer_Street": 1,
                "location.Customer_Zipcode": 1,
                "location.Latitude": 1,
                "location.Longitude": 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    const totalCustomers = await Customer.countDocuments();

    return {
        customers,
        pagination: {
            currentPage: page,
            limit,
            totalCustomers,
            totalPages: Math.ceil(totalCustomers / limit)
        }
    };
};

// ================= GET CUSTOMER BY ID =================
const getCustomerById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid customer ID");
    }

    const customer = await Customer.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(id) }
        },
        {
            $lookup: {
                from: "customer_locations",
                localField: "_id",
                foreignField: "customerRef",
                as: "location"
            }
        },
        {
            $unwind: {
                path: "$location",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                Customer_Id: 1,
                Customer_FullName: 1,
                Customer_Segment: 1,
                "location.Customer_City": 1,
                "location.Customer_State": 1,
                "location.Customer_Country": 1,
                "location.Customer_Street": 1,
                "location.Customer_Zipcode": 1,
                "location.Latitude": 1,
                "location.Longitude": 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!customer || customer.length === 0) {
        throw new Error("Customer not found");
    }

    return customer[0];
};

// ================= UPDATE CUSTOMER =================
const updateCustomer = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid customer ID");
    }

    const customer = await Customer.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!customer) {
        throw new Error("Customer not found");
    }

    return customer;
};

// ================= DELETE CUSTOMER =================
const deleteCustomer = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid customer ID");
    }

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
        throw new Error("Customer not found");
    }

    return {
        message: "Customer deleted successfully",
        data: customer
    };
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};