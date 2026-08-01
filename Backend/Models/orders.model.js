const mongoose = require("mongoose")
const { Schema } = mongoose 

const orderSchema = new Schema({
    customerId : {
        type: Schema.Types.ObjectId,
        ref: "customer"
    },
    shippingId : {
        type: Schema.Types.ObjectId,
        ref: "shipping"
    },
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
            values: ["DEBIT", "TRANSFER", "CASH", "PENDING PAYMENT", ]
        }
    }
}, 
{ timestamps : true})
const orderModel = mongoose.model("orders", orderSchema)
module.exports = { orderModel }

