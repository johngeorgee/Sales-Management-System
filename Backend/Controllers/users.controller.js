const { userModel } = require("../Models/users.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//Get All Users
const getUsers = ((req, res)=>{
    userModel.find().then((users)=>{
        res.status(201).json({
            message : "User Found Successfully",
            data  : users,
        })
    }).catch( (error) =>{
        console.log(error);   
        res.status(500).send({
            message: "Users not found , please try again "
        })
    }   
    )
})

//Get User By ID 
const getUserById = ((req, res)=>{
    userId = req.params.id;
    userModel.findById(userId).then((user)=>{
        if(!user){
            res.status(404).send("User Not Found, Please Try Again")
        }
        res.status(200).send(
            {
                message : "User Fetched Successfully", 
                userData : user
            })
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("user not fetched , try again later")
        
    })
})

//Add User => Register 
const register = ((req, res)=>{
    const data = req.body;
    userModel.create(data).then(() => {
      res.status(201).json({ msg: "user added successfully", data: data});
}).catch((err) => {
      console.log(err);
      res.status(500).send("user not added , try again");
    })
})

//Login 
const login = ((req, res)=>{
    const data = req.body
    console.log(req);
    
    console.log(data);
    

    const email = req.body.email
    console.log(email);
    
    const password = req.body.password
    console.log(password);

    if(!email || !password){
        res.status(400)
        .send({msg: "please enter valid Data .. Email & Password is required"})
        return;
    }
    userModel.findOne({email : email})
    .then((user)=>{
        if(!user){
            res.status(401).send({
                message : "invalid email or password .. Try Again"
            })
            return;
        }
        bcrypt.compare(password, user.password)
        .then((isValid)=>{
            if(!isValid){
                res.status(401).send({
                    message: "Invalid Email or Password",
                    err: err
                });
                return;
            }

            var token = jwt.sign(
                {id: user._id, email: user.email },
                process.env.JWT_SECRET,
            );
            res.status(200).send({
                message : "Login Successfully",
                token: token
            })
        }).catch((err)=>{
            console.log(err);
            res.status(401).send({
                message : "Invalid Email or Password.. Register First",
                err: err,
            })
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({
            message : "Error while login please try again  ",
            err: err
        });
        
    });
    
});

//Logout 
const logout = ((req, res) =>{
    const token = req.headers.token
    if(!token){
        res.status(404).send({message : "Invalid Token"})
        return   
    }
     res.status(200).send({message : "SignOut Operation Done", token: token})
    
})

//Update User
const updateUser = (req, res) =>{
    const data = req.body
    const userId = req.params.id
    userModel.findByIdAndUpdate(userId, data, { new : true})
    .then((updated)=>{
        if(!updated){
            return res.status(404).json({message : "User Not Found"});
        }
        res.status(200).send("User Updated Successfully")
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({message : "Cannot Update User, Please Try Again "})
    })
}

//Delete User
const deleteUser = (req, res) => {
  const userId = req.params.id;

  userModel
    .findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ msg: "user not found" });
      }

      res
        .status(200)
        .json({ msg: "user deleted successfully", data: deletedUser });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("user not deleted, try again");
    });
};
module.exports = {getUsers, getUserById, register,login, logout, updateUser, deleteUser }



