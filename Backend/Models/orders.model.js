const mongoose = require("mongoose")
const { Schema } = mongoose 

const orderSchema = new Schema({
    customerRef : {
        type: Schema.Types.ObjectId,
        ref: "customers"
    },
    shippingRef : {
        type: Schema.Types.ObjectId,
        ref: "shipping"
    },
    order_date: Number,
    shipping_date: Number,
    orderStatus : {
        type: String,
        enum: {
            
            values: ["Closed", "Pending Payement", "Processing", "Complete"]
              }
    },
    orderAddress : {
        state : String,
        country : String,
        region: String,
        city: String
    },
    market : String,
    Type : {
         type: String,
        enum: { 
            values: ["DEBIT", "TRANSFER", "CASH", "PENDING PAYMENT"]
        }
    }
}, 
{ timestamps : true})
const orderModel = mongoose.model("orders", orderSchema)
module.exports = { orderModel }

