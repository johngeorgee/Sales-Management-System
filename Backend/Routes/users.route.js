const { body, validationResult } = require("express-validator")
const express = require("express")
const userRouter = express.Router()
const {checkToken} = require("../Middlewares/isAuth")
const {getUsers, getUserById, register, login, logout, updateUser, deleteUser} = require("../Controllers/users.controller")
//Get All Users 
userRouter.get("/", checkToken, getUsers)

//Get User By ID 
userRouter.get("/:id", checkToken ,getUserById)


//Add User ( Register )
userRouter.post("/register", register)

//Login 
userRouter.post("/login", login)

//Logout
userRouter.get("/logout", logout)
//Update User
userRouter.put("/:id", checkToken, updateUser)

//Delete User 
userRouter.delete("/:id", checkToken,  deleteUser)

module.exports = { userRouter }