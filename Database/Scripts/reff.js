const mongoose = require("mongoose");
const connectDB = require("../Config/db");

async function createReferences() {
  try {
    await connectDB();
    const db = mongoose.connection;
    console.log("Connected to MongoDB for References Migration");

    // Collections 
    const customers = db.collection("customers");
    const customerLocations = db.collection("customer_locations");
    const departments = db.collection("departments");
    const categories = db.collection("categories");
    const products = db.collection("products");
    const shipping = db.collection("shipping");
    const orders = db.collection("orders");
    const orderItems = db.collection("order_items");

    // 1. Create Maps
    console.log("Building lookup maps");

    const customerMap = new Map();
    (await customers.find({}).toArray()).forEach(c => customerMap.set(c.Customer_Id, c._id));

    const departmentMap = new Map();
    (await departments.find({}).toArray()).forEach(d => departmentMap.set(d.Department_Id, d._id));

    const categoryMap = new Map();
    (await categories.find({}).toArray()).forEach(cat => categoryMap.set(cat.Category_Id, cat._id));

    const productMap = new Map();
    (await products.find({}).toArray()).forEach(p => productMap.set(p.Product_Card_Id, p._id));

    const shippingMap = new Map();
    (await shipping.find({}).toArray()).forEach(s => shippingMap.set(s.Shipping_ID, s._id));

    const orderMap = new Map();
    (await orders.find({}).toArray()).forEach(o => orderMap.set(o.Order_Id, o._id));

    console.log("All Lookup Maps created successfully!");

    // 2. Update Customer Locations (Bulk)
    const customerLocationsData = await customerLocations.find({}).toArray();
    if (customerLocationsData.length > 0) {
      const locOps = customerLocationsData.map(loc => ({
        updateOne: {
          filter: { _id: loc._id },
          update: { $set: { customerRef: customerMap.get(loc.Customer_Id) } }
        }
      }));
      await customerLocations.bulkWrite(locOps);
      console.log("Customer Locations references updated.");
    }
    // 3. Update Categories (Bulk)
    const categoriesData = await categories.find({}).toArray();
    if (categoriesData.length > 0) {
      const catOps = categoriesData.map(category => ({
        updateOne: {
          filter: { _id: category._id },
          update: { $set: { departmentRef: departmentMap.get(category.Department_Id) } }
        }
      }));
      await categories.bulkWrite(catOps);
      console.log("Categories references updated.");
    }


    // 4. Update Products (Bulk)
    const productsData = await products.find({}).toArray();
    if (productsData.length > 0) {
      const prodOps = productsData.map(product => ({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { categoryRef: categoryMap.get(product.Product_Category_Id) } }
        }
      }));
      await products.bulkWrite(prodOps);
      console.log("Products references updated.");
    }

    // 5. Update Orders (Bulk)
    const ordersData = await orders.find({}).toArray();
    if (ordersData.length > 0) {
      const orderOps = ordersData.map(order => ({
        updateOne: {
          filter: { _id: order._id },
          update: {
            $set: {
              customerRef: customerMap.get(order.Customer_Id),
              shippingRef: shippingMap.get(order.Shipping_ID)
            }
          }
        }
      }));
      await orders.bulkWrite(orderOps);
      console.log("Orders references updated.");
    }

    // 6. Update Order Items (Bulk)
    const orderItemsData = await orderItems.find({}).toArray();
    if (orderItemsData.length > 0) {
      const itemOps = orderItemsData.map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              orderRef: orderMap.get(item.Order_ID),
              productRef: productMap.get(item.Product_Card_ID)
            }
          }
        }
      }));
      await orderItems.bulkWrite(itemOps);
      console.log("Order Items references updated.");
    }

    console.log(" All references mapped and updated successfully matching your ETL and ERD schema!");

  } catch (error) {
    console.error("Reference Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createReferences();