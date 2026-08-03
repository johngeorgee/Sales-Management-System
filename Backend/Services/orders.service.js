const { orderModel } = require("../Models/orders.model")
const { orderListModel } = require("../Models/orderList.model")
const { shippingModel } = require("../Models/shipping.model")
const { Customer } = require("../Models/customer.model");
// const { getAllOrderItems } = require("../Controllers/order.controller");

const createOrder = async(data) =>{
    const {
        customerRef,
        shippingRef,
        orderStatus,
        orderAddress,
        market,
        type,
        items
    } = data;

    //Validation 
    validateOrderData(customerRef, shippingRef, items)

     await checkCustomer(customerRef)

    
    await checkShipping(shippingRef)

    //Create Order
    const order = await orderModel.create({
        customerRef,
        shippingRef,
        orderStatus,
        orderAddress,
        market,
        Type: type
    });
    const orderss = await orderModel.findOne();

console.log("ORDER SHIPPING REF:", orderss.shippingRef);

console.log(
    "REF MODEL:",
    orderModel.schema.path("shippingRef").options.ref
);

console.log(
    "SHIPPING MODEL NAME:",
    shippingModel.modelName
);

console.log(
    "SHIPPING COLLECTION:",
    shippingModel.collection.name
);
    //Prepare Items & Validating Inputs  + Business Calculations 
    const orderItems = prepareOrderItems(items, order._id)

    //Create Order Items 
    const createdItems = await orderListModel.insertMany(orderItems)

    return {
        order,
        items: createdItems
    }


};

const getOrders = async () => {
    const orders = await orderModel.find().populate("customerRef", "Customer_FullName Customer_Segment")
    .populate("shippingRef", "Shipping_Mode Delivery_Status Days_for_shipping_real Days_for_shipment_scheduled Late_delivery_risk");

    if (!orders || orders.length === 0) {
        throw new Error("No orders found");
    }

    return orders;
};

const getOrderItems = async () => {
    const orderItems = await orderListModel.find()
    .populate("orderRef").populate("productRef");

    if (!orderItems || orderItems.length === 0) {
        throw new Error("No order items found");
    }

    return orderItems;
};

const updateOrder = async (orderId, data) => {
    const {
        orderStatus,
        orderAddress,
        market,
        type,
        shippingRef
    } = data;

    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    if (shippingRef) {
        await checkShipping(shippingRef);
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        {
            orderStatus,
            orderAddress,
            market,
            Type: type,
            shippingRef
        },
        {
            new: true,
            runValidators: true
        }
    );

    return updatedOrder;
};


const deleteOrder = async (orderId) => {
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    await orderModel.findByIdAndDelete(orderId);

    return {
        message: "Order deleted successfully"
    };
};


function validateOrderData(customerId, shippingId, items){
    if(!customerId || !shippingId){
        throw new Error("Customer and Shipping are Required")
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Order must contain at least one item");
    }
}
//Future Work 
async function checkCustomer(customerId){
     const customer = await Customer.findById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }
    return customer;
}
 async function checkShipping(shippingId){
         const shipping = await shippingModel.findById(shippingId);
         console.log(shipping);
         

     if (!shipping) {
         throw new Error("Shipping not found");
     }

     return shipping;
 }

function calculations(productPrice,  productQuantity,productDiscount){
        const grossSales = productPrice * productQuantity;

        const salesPerCustomer = grossSales - productDiscount;

        const benefitPerOrder = salesPerCustomer;

        return { grossSales, salesPerCustomer, benefitPerOrder}
}

function prepareOrderItems(items, orderId){
        const orderItems = []
        for (const item of items) {

        if (!item.productId) {
            throw new Error("Product ID is required");
        }

        if (!item.productPrice && item.productPrice !== 0) {
            throw new Error("Product price is required");
        }

        if (!item.productQuantity  ) {
            throw new Error("Product quantity is required");
        }
        if(item.productQuantity < 0){
            throw new Error("Product quantity cannot be less than 1");
        }

        const productPrice = item.productPrice;
        const productQuantity = item.productQuantity;

        const productDiscount = item.productDiscount || 0;
        const productDiscountRate = item.productDiscountRate || 0;
        const  { grossSales, salesPerCustomer, benefitPerOrder } = calculations(productPrice, productQuantity, productDiscount)
        
         orderItems.push({
             orderId: orderId,
            productId: item.productId,

            productPrice,
            productQuantity,

            productDiscount,
            productDiscountRate,

            grossSales,
            salesPerCustomer,
            benefitPerOrder
    })
    }
    return orderItems;
}
module.exports = { createOrder, getOrders, getOrderItems, updateOrder, deleteOrder }