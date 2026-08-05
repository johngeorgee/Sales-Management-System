const Department = require("../Models/department.model");
const asyncHandler = require("../Middlewares/asyncHandler");

// Create Department
const createDepartment = asyncHandler(async (req, res) => {

    const department = await Department.create(req.body);

    res.status(201).json({
        success: true,
        message: "Department created successfully",
        data: department
    });

});

// Get All Departments
const getAllDepartments = asyncHandler(async (req, res) => {

    const departments = await Department.find();

    res.status(200).json({
        success: true,
        count: departments.length,
        data: departments
    });

});

// Get Department By Id
const getDepartmentById = asyncHandler(async (req, res) => {

    const department = await Department.findById(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    res.status(200).json({
        success: true,
        data: department
    });

});

// Update Department
const updateDepartment = asyncHandler(async (req, res) => {

    const department = await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    res.status(200).json({
        success: true,
        message: "Department updated successfully",
        data: department
    });

});

// Delete Department
const deleteDepartment = asyncHandler(async (req, res) => {

    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
        res.status(404);
        throw new Error("Department not found");
    }

    res.status(200).json({
        success: true,
        message: "Department deleted successfully"
    });

});

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};