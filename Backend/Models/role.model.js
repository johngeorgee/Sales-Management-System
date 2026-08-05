const mongoose  = require("mongoose")
const { Schema } = mongoose
const roleSchema = new Schema({
    name: {
        type: String,
    }, 
    permissions : [String]
    
}, { collection: "roles" })
const roleModel = mongoose.model("roles", roleSchema)

module.exports = { roleModel }