const mongoose = require("mongoose")
const { Int32 } = require("mongoose/lib/schema/index")
const { Schema } = mongoose 

const orderListSchema = new Schema({
    orderRef : {
        type: Schema.Types.ObjectId,
        ref: "orders"
    },
    productRef : {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    Order_Item_ID: Number,
    Product_Card_ID: Number,
    Order_ID : {
        type: Number,
        required: true,
        min: 0
    },
    Order_Item_Quantity : {
        type: Int32,
        min: 1,
        required: true
    },
    Order_Item_Product_Price : {
        type: Number,
        min: 0,
        max: 1
    },
    Order_Item_Discount : Number,
    Order_Item_Discount_Rate : Number,
    Order_Item_Profit_Ratio : {
        type: Number,
        min: 0,
        max: 1
    },
    Gross_Sales : Number,
    Gross_Sales2 : Number,
    Sales_per_Customer: Number,
    Benefit_per_Order : Number,
    Order_Profit_Per_Order: Number,
})
const orderListModel = mongoose.model("order_items", orderListSchema)
module.exports = { orderListModel }

