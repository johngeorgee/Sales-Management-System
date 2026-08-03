const app = require("./app")
const mongoose = require("mongoose")


mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log(mongoose.connection.name);
    
    console.log("server connected to db successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(process.env.PORT, ()=>{
    console.log(`Example App listening on port ${process.env.PORT}`);
  
})