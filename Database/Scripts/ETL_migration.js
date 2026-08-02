const mongoose = require('mongoose');
const XLSX = require('xlsx');
const connectDB = require('../Config/db');

async function runETL() {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Read excel file
    const workbook = XLSX.readFile('./Data/Final_Data.xlsx');
    const sheetName = workbook.SheetNames[0];
    let data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`Total rows read from Excel: ${data.length}`);

    //  clean column
    data = data.map(row => {
      let cleanRow = {};
      Object.keys(row).forEach(key => {
        cleanRow[key.trim()] = row[key];
      });
      return cleanRow;
    });

    //  load_table 
    async function loadCollection(collectionName, excelColumns, mongoFields, transformFn = null) {
      const dbCollection = mongoose.connection.collection(collectionName);
      
      // check if collection already  has Documents
      const count = await dbCollection.countDocuments({});
      if (count > 0) {
        console.log(`${collectionName} already loaded`);
        return;
      }

      // (drop_duplicates)
      let uniqueMap = new Map();
      data.forEach(row => {
        let keyValues = excelColumns.map(col => row[col]);
        // Skip row if pk value is missing 
        if (keyValues[0] !== undefined && keyValues[0] !== null) {
          let uniqueKey = keyValues.join('_');
          if (!uniqueMap.has(uniqueKey)) {
            let newObj = {};
            excelColumns.forEach((col, index) => {
              newObj[mongoFields[index]] = row[col];
            });
            uniqueMap.set(uniqueKey, newObj);
          }
        }
      });

      let records = Array.from(uniqueMap.values());

      if (transformFn) {
        records = transformFn(records);
      }

      if (records.length > 0) {
        await dbCollection.insertMany(records);
        console.log(`${collectionName} loaded successfully.`);
      }
    }

    // 1. Customers
    await loadCollection('customers', 
      ['Customer Id', 'Customer FullName', 'Customer Segment'],
      ['Customer_Id', 'Customer_FullName', 'Customer_Segment']
    );

    // 2. Customer_Location
    await loadCollection('customer_locations', 
      ['Customer Id', 'Customer City', 'Customer State', 'Customer Country', 'Customer Street', 'Customer Zipcode', 'Latitude', 'Longitude'],
      ['Customer_Id', 'Customer_City', 'Customer_State', 'Customer_Country', 'Customer_Street', 'Customer_Zipcode', 'Latitude', 'Longitude']
    );

    // 3. Departments
    await loadCollection('departments', 
      ['Department Id', 'Department Name'],
      ['Department_Id', 'Department_Name']
    );

    // 4. Categories
    await loadCollection('categories', 
      ['Category Id', 'Category Name', 'Department Id'],
      ['Category_Id', 'Category_Name', 'Department_Id']
    );

    // 5. Products
    await loadCollection('products', 
      ['Product Card Id', 'Product Category Id', 'Product Name', 'Product Price', 'Product Status', 'Product Image'],
      ['Product_Card_Id', 'Product_Category_Id', 'Product_Name', 'Product_Price', 'Product_Status', 'Product_Image']
    );

    // 6. Shipping (generating sequentail Shipping_id)
    let shippingMap = new Map();
    data.forEach(row => {
      const key = `${row['Shipping Mode']}_${row['Delivery Status']}_${row['Days for shipping (real)']}_${row['Days for shipment (scheduled)']}_${row['Late_delivery_risk']}`;
      if (!shippingMap.has(key)) {
        shippingMap.set(key, {
          Shipping_Mode: row['Shipping Mode'],
          Delivery_Status: row['Delivery Status'],
          Days_for_shipping_real: row['Days for shipping (real)'],
          Days_for_shipment_scheduled: row['Days for shipment (scheduled)'],
          Late_delivery_risk: row['Late_delivery_risk']
        });
      }
    });
    let shippingList = [];
    let counter = 1;
    shippingMap.forEach((value) => {
      shippingList.push({ Shipping_ID: counter++, ...value });
    });

    const shippingCollection = mongoose.connection.collection('shipping');
    if (await shippingCollection.countDocuments({}) === 0 && shippingList.length > 0) {
      await shippingCollection.insertMany(shippingList);
      console.log("shipping loaded successfully.");
    }

    // lookup map to join Shipping , Orders
    const shippingLookup = new Map();
    shippingList.forEach(s => {
      const key = `${s.Shipping_Mode}_${s.Delivery_Status}_${s.Days_for_shipping_real}_${s.Days_for_shipment_scheduled}_${s.Late_delivery_risk}`;
      shippingLookup.set(key, s.Shipping_ID);
    });

    // Merge 
    data = data.map(row => {
      const shipKey = `${row['Shipping Mode']}_${row['Delivery Status']}_${row['Days for shipping (real)']}_${row['Days for shipping (scheduled)']}_${row['Late_delivery_risk']}`;
      return {
        ...row,
        Shipping_ID: shippingLookup.get(shipKey)
      };
    });

    // 7. Orders
      await loadCollection('orders',
      ['Order Id', 'Customer Id', 'Shipping_ID', 'order date (DateOrders)', 'shipping date (DateOrders)', 'Order Status', 'Order City', 'Order State', 'Order Country', 'Order Region', 'Market', 'Type'],
      ['Order_Id', 'Customer_Id', 'Shipping_ID', 'order_date', 'shipping_date', 'Order_Status', 'Order_City', 'Order_State', 'Order_Country', 'Order_Region', 'Market', 'Type'],
      (records) => records.map(r => {
        const originalRow = data.find(item => item['Order Id'] === r.Order_Id);
        const shipKey =`${originalRow['Shipping Mode']}_${originalRow['Delivery Status']}_${originalRow['Days for shipping (real)']}_${originalRow['Days for shipment (scheduled)']}_${originalRow['Late_delivery_risk']}`;
        
        return {
          ...r,
          Customer_Id: r.Customer_Id,
          Shipping_ID: shippingLookup.get(shipKey) || r.Shipping_ID
        };
      })
    );

    // 8. Order_Items
    await loadCollection('order_items',
      ['Order Item Id', 'Order Id', 'Product Card Id', 'Order Item Quantity', 'Order Item Product Price', 'Order Item Discount', 'Order Item Discount Rate', 'Order Item Profit Ratio', 'Gross Sales', 'Gross Sales2', 'Sales per customer', 'Benefit per order', 'Order Profit Per Order'],
      ['Order_Item_ID', 'Order_ID', 'Product_Card_ID', 'Order_Item_Quantity', 'Order_Item_Product_Price', 'Order_Item_Discount', 'Order_Item_Discount_Rate', 'Order_Item_Profit_Ratio', 'Gross_Sales', 'Gross_Sales2', 'Sales_per_Customer', 'Benefit_per_Order', 'Order_Profit_Per_Order']
    );

    console.log('good - All data migrated to MongoDB successfully via Node.js!');

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

runETL();
