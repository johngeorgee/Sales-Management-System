const mongoose = require("mongoose") 
const { Schema } = mongoose 
const shippingSchema = new Schema({ 
    Delivery_Status : { 
        type: String, 
        enum :{ 
            values: ["Advance Shipping", "Late Delivery", "Shipping On Time", "Shipping Cancelled"] 
        }, 
    },
    Shipping_ID: Number,
    Shipping_Mode : { 
        type: String, 
        enum : { 
            values: ["Standard Class", "First Class","Second Class", "Same Day", "Shipping Cancelled"] 
        }
     }, 
     Days_for_shipment_scheduled : { type: Number, min: 2 

     },
    Days_for_shipping_real : {
         type: Number, min: 1
     }, 
     Late_delivery_risk : { 
         type: String, 
         enum :{ 
            values: ["No Risk", "High Risk"] 
        } 
    }, 
},{
    collection : "shipping"
})


const shippingModel = mongoose.model("shipping", shippingSchema) 
module.exports = { shippingModel }