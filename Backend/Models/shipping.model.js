const mongoose = require("mongoose")
const { Schema } = mongoose 

const shippingSchema = new Schema({
    deliveryStatus : {
        type: String,
        enum :{
                values: ["Advance Shipping", "Late Delivery", "Shipping On Time", "Shipping Cancelled", ""]
        },  
    },
    shippingMode :       
     { 
        type: String,
        enum :{    
            values: ["Standard Class", "First Class","Second Class", "Same Day", "Shipping Cancelled"]
        }
    },
    realShippingDays : {
        type: Number,
        min: 2,
        max: 7
    },
     scheduledShippingDays : {
        type: Number,
        min: 1,
        max: 7
    },
    lateDeliveryRisk :       
     { 
            type: String,
            enum :{
                values: ["No Risk", "High Risk"]
        }
    },

})
const shippingModel = mongoose.model("shipping", shippingSchema)
module.exports = { shippingModel }

