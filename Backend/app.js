const express = require("express")
const app = express();
const {isLogged} = require("./Middlewares/logger")
const {notFound} = require("./Middlewares/notFound")
const { userRouter, authRouter } = require("./Routes/users.route")
const { roleRouter } = require("./Routes/role.route")
const { orderRouter } = require("./Routes/orders.route")
const { customerRouter } =  require("./Routes/customer.route");
const { customerLocationRouter } = require("./Routes/customerLocation.route");
const {shippingRouter} = require("./Routes/shipping.route")
const {productRouter} = require("./Routes/product.route")
const {categoryRouter} = require("./Routes/category.route")
const {departmentRouter} = require("./Routes/department.route")
const { supplierRouter } = require("./Routes/suppliers.route");
const { purchaseRouter }  = require("./Routes/purchase.route");
const { inventoryRouter }  = require("./Routes/inventory.route");
const { orderItemsRouter } = require("./Routes/ordersItems.route");
const cors = require("cors")


require("dotenv").config()
//Middlewares
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:4200'// Allow only these headers
};
app.use(cors(corsOptions))
app.use(isLogged)
//Routes Configuration 
app.use("/users", userRouter) //usersRouter
app.use("/roles", roleRouter) //rolesRouter
app.use("/auth", authRouter) //auth router
app.use("/orders", orderRouter)
app.use("/shipping", shippingRouter)
app.use("/customers", customerRouter)
app.use("/customer-locations", customerLocationRouter)
app.use("/products", productRouter)
app.use("/categories", categoryRouter)
app.use("/departments", departmentRouter)
app.use("/suppliers", supplierRouter);
app.use("/purchases", purchaseRouter);
app.use("/order-items", orderItemsRouter);
app.use(notFound)

//File Export
module.exports = app 

