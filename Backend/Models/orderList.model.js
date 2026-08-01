const mongoose = require("mongoose")
const { Int32 } = require("mongoose/lib/schema/index")
const { Schema } = mongoose 

const orderListSchema = new Schema({
    orderId : {
        type: Schema.Types.ObjectId,
        ref: "orders"
    },
    productId : {
        type: Schema.Types.ObjectId,
        ref: "products"
    },
    productPrice : {
        type: Number,
        required: true,
        min: 0
    },
    productQuantity : {
        type: Int32,
        min: 1,
        required: true
    },
    productDiscount : {
        type: Number,
        min: 0,
        max: 1
    },
    productDiscountRate : Number,
    profitRatio : {
        type: Number,
        min: 0,
        max: 1
    },
    grossSales : Number,
    salesPerCustomer: Number,
    benefitPerOrder : Number,
})
const orderListModel = mongoose.model("order_items", orderListSchema)
module.exports = { orderListModel }

