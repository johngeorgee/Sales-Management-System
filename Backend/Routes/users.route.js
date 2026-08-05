const { body, validationResult } = require("express-validator")
const express = require("express")
const authRouter = express.Router()
const userRouter = express.Router()
const {checkToken} = require("../Middlewares/isAuth")
const {checkPermissions} = require("../Middlewares/isAllowed")
const {getUsers, getUserById, register, login, logout, updateUser, deleteUser} = require("../Controllers/users.controller")
//Get All Users 
userRouter.get("/", checkToken, getUsers)

//Get User By ID 
userRouter.get("/:id", checkToken ,getUserById)


//Add User ( Register )
authRouter.post("/register", register)

//Login 
authRouter.post("/login", login)

//Logout
authRouter.post("/logout", logout)
//Update User
userRouter.put("/:id", checkToken, updateUser)

//Delete User 
userRouter.delete("/:id", checkToken, checkPermissions('manage_users') ,deleteUser)

module.exports = { userRouter, authRouter }