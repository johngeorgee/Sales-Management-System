const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require("bcrypt")
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true,
        min: 8
    },
    phoneNumber : Number,
  
    gender: {
    type: String,
    enum: {
      values: ["female", "male"],
      message: "plz enter female or male",
    },
  },
    email : {
    type: String,
    validate: {
      validator: function (emailInput) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          emailInput,
        );
      },
      message: "plz enter valid email",
      lowercase: true
    },
    },
     age: {
        type: Number,
        required: false,
     },
     roleId: {
      type: Schema.Types.ObjectId,
      ref : "role"
     },
     isActive : Boolean
},
{ timestamps: true}
);

//Password Hashing 
userSchema.pre("save", async function(){
  console.log(this.username, this.email, this.password);

  const salt = await bcrypt.genSalt(10)

  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
})

const userModel = mongoose.model("users", userSchema)



module.exports = { userModel }