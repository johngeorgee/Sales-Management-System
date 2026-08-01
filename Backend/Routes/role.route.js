const express = require("express")
const roleRouter = express.Router()
const {addRoles, getRoles} = require("../Controllers/roles.controller")

roleRouter.get("/", getRoles)
roleRouter.post("/", addRoles)

module.exports = {roleRouter}
