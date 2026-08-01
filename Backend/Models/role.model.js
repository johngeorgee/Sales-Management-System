const mongoose  = require("mongoose")
const { Schema } = mongoose
const roleSchema = new Schema({
    name: {
        type: String,
    }, 
    permissions : [String]
    
})
const roleModel = mongoose.model("roles", roleSchema)

module.exports = { roleModel }