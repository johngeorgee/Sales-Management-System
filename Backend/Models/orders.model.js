const mongoose = require("mongoose")
const { collection } = require("./products.model")
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
    Order_Status : {
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
    Market : String,
    Type : {
         type: String,
        enum: { 
            values: ["DEBIT", "TRANSFER", "CASH", "PENDING PAYMENT"]
        }
    }
}, 
{ timestamps : true,
    collection: "orders"
})
const orderModel = mongoose.model("orders", orderSchema)
module.exports = { orderModel }

