// Services/dashboard.service.js
const { orderModel } = require("../Models/orders.model");
const { orderListModel } = require("../Models/orderList.model");
const { productModel } = require("../Models/products.model");
const { purchaseModel } = require("../Models/purchase.model");
const { Customer } = require("../Models/customer.model");
const { supplierModel } = require("../Models/suppliers.model");

const getDashboardData = async () => {
  // ✅ Use the correct status values from the database
  const completedStatuses = ["COMPLETE", "CLOSED"];

  const [
    summary,
    salesOverTime,
    topProducts,
    recentOrders,
    orderStatus,
    purchaseStats,
    inventoryStats,
    lowStockProducts,
  ] = await Promise.all([

    // =========================
    // SUMMARY
    // =========================
    Promise.all([

      // Total Sales & Profit
      orderListModel.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "orderRef",
            foreignField: "_id",
            as: "order",
          },
        },
        {
          $unwind: "$order",
        },
        {
          $match: {
            "order.Order_Status": {
              $in: completedStatuses,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: {
                $ifNull: ["$Gross_Sales", 0],
              },
            },
            totalProfit: {
              $sum: {
                $ifNull: ["$Order_Profit_Per_Order", 0],
              },
            },
          },
        },
      ]),

      // Total Orders
      orderModel.countDocuments(),

      // Total Products
      productModel.countDocuments(),

      // Total Customers
      Customer.countDocuments(),

      // Total Suppliers
      supplierModel.countDocuments(),

      // Out of Stock
      productModel.countDocuments({
        Product_Stock: 0,
      }),

      // Low Stock
      productModel.countDocuments({
        $expr: {
          $lte: [
            "$Product_Stock",
            "$Product_Reorder_Level",
          ],
        },
      }),

      // Total Purchases
      purchaseModel.aggregate([
        {
          $match: {
            status: "Received",
          },
        },
        {
          $group: {
            _id: null,
            totalPurchases: {
              $sum: {
                $ifNull: ["$totalPrice", 0],
              },
            },
          },
        },
      ]),
    ]),

    // =========================
    // SALES OVER TIME
    // =========================
    orderListModel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderRef",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $match: {
          "order.Order_Status": {
            $in: completedStatuses,
          },
          "order.createdAt": {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$order.createdAt",
            },
            month: {
              $month: "$order.createdAt",
            },
          },
          sales: {
            $sum: {
              $ifNull: ["$Gross_Sales", 0],
            },
          },
          profit: {
            $sum: {
              $ifNull: ["$Order_Profit_Per_Order", 0],
            },
          },
          orders: {
            $addToSet: "$order._id",
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          sales: 1,
          profit: 1,
          orders: {
            $size: "$orders",
          },
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]),

    // =========================
    // TOP PRODUCTS
    // =========================
    orderListModel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderRef",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $match: {
          "order.Order_Status": {
            $in: completedStatuses,
          },
        },
      },
      {
        $group: {
          _id: "$productRef",
          quantitySold: {
            $sum: {
              $ifNull: ["$Order_Item_Quantity", 0],
            },
          },
          sales: {
            $sum: {
              $ifNull: ["$Gross_Sales", 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$product.Product_Name",
          quantitySold: 1,
          sales: 1,
        },
      },
      {
        $sort: {
          quantitySold: -1,
        },
      },
      {
        $limit: 5,
      },
    ]),

    // =========================
    // RECENT ORDERS - ✅ FIXED
    // =========================
    orderModel.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerRef",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "orderRef",
          as: "items",
        },
      },
      {
        $project: {
          _id: 1,
          Order_Status: 1,  // ✅ Use correct field name
          Type: 1,
          market: 1,
          createdAt: 1,
          customerName: "$customer.Customer_FullName",
          customerId: "$customer.Customer_ID",
          // ✅ Fix: Calculate total amount from order items
          amount: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: {
                      $ifNull: ["$$item.Gross_Sales", 0],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ]),

    // =========================
    // ORDER STATUS - ✅ FIXED: Map status values to display names
    // =========================
    orderModel.aggregate([
      {
        $group: {
          _id: "$Order_Status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    // =========================
    // PURCHASES
    // =========================
    purchaseModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: {
            $sum: {
              $ifNull: ["$totalPrice", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
          total: 1,
        },
      },
    ]),

    // =========================
    // INVENTORY
    // =========================
    productModel.aggregate([
      {
        $group: {
          _id: null,
          totalStockUnits: {
            $sum: "$Product_Stock",
          },
          inventoryValue: {
            $sum: {
              $multiply: [
                "$Product_Stock",
                "$Product_Price",
              ],
            },
          },
        },
      },
    ]),

    // =========================
    // LOW STOCK PRODUCTS
    // =========================
    productModel.aggregate([
      {
        $match: {
          $expr: {
            $lte: [
              "$Product_Stock",
              "$Product_Reorder_Level",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryRef",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: "$Product_Name",
          stock: "$Product_Stock",
          reorderLevel: "$Product_Reorder_Level",
          category: {
            $ifNull: [
              "$category.Category_Name",
              "Uncategorized",
            ],
          },
        },
      },
      {
        $sort: {
          stock: 1,
        },
      },
      {
        $limit: 5,
      },
    ]),
  ]);

  // =========================
  // SUMMARY RESULTS
  // =========================

  const [
    salesSummary,
    totalOrders,
    totalProducts,
    totalCustomers,
    totalSuppliers,
    outOfStockCount,
    lowStockCount,
    purchaseSummary,
  ] = summary;

  // =========================
  // FINAL RESPONSE
  // =========================

  return {
    summary: {
      totalSales: salesSummary[0]?.totalSales || 0,
      totalProfit: salesSummary[0]?.totalProfit || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      totalSuppliers,
      outOfStockProducts: outOfStockCount,
      lowStockProducts: lowStockCount,
      totalPurchases: purchaseSummary[0]?.totalPurchases || 0,
      totalStockUnits: inventoryStats[0]?.totalStockUnits || 0,
      inventoryValue: inventoryStats[0]?.inventoryValue || 0,
    },
    salesOverTime,
    topProducts,
    recentOrders,
    orderStatus,
    purchases: purchaseStats,
    lowStockProducts,
    inventory: {
      totalStockUnits: inventoryStats[0]?.totalStockUnits || 0,
      inventoryValue: inventoryStats[0]?.inventoryValue || 0,
    },
  };
};

module.exports = {
  getDashboardData,
};