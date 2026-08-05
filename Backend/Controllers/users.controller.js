const { userModel } = require("../Models/users.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//Get All Users
const getUsers = ((req, res)=>{
    userModel.find().populate("roleId").then((users)=>{
                    const formattedUsers = users.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                age: user.age,
                isActive: user.isActive,
                role: user.roleId ? {
                    _id: user.roleId._id,
                    name: user.roleId.name,
                    permissions: user.roleId.permissions
                } : null,  // If no role assigned
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
        res.status(200).json({
            
            message : "User Found Successfully",
            data  : formattedUsers,
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
    const userId = req.params.id;
    userModel.findById(userId).populate("roleId").then((user)=>{
        if(!user){
           return res.status(404).send("User Not Found, Please Try Again")
        }
                    const formattedUser = {
                _id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                age: user.age,
                isActive: user.isActive,
                role: user.roleId ? {
                    _id: user.roleId._id,
                    name: user.roleId.name,
                    permissions: user.roleId.permissions
                } : null,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        res.status(200).send(
            {
                message : "User Fetched Successfully", 
                userData : formattedUser
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
      res.status(201).json({ msg: "user added successfully", data: { _id: data._id, username: data.username, email: data.email, roleId: data.roleId } });
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
    userModel.findOne({email : email}).populate("roleId")
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
                {id: user._id, email: user.email, role: user.roleId?.name || 'user'},
                    process.env.JWT_SECRET,{expiresIn: "1h"},
            );
            res.status(200).send({
                message : "Login Successfully",
                token: token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.roleId ?  {
                                _id: user.roleId._id,
                                name: user.roleId.name,
                                permissions: user.roleId.permissions
                            } : null
                }
            });
        }).catch((err)=>{
            console.log(err);
            res.status(401).json({
                message : "Invalid Email or Password.. Register First",
                err: err,
            })
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
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
        res.status(200).send({message: "User Updated Successfully", 
            data: {
                _id: updated._id,
                username: updated.username,
                email: updated.email,
                role: updated.roleId ? {
                    _id: updated.roleId._id,
                    name: updated.roleId.name,
                } : null

            }
        })
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
        .json({ msg: "user deleted successfully", data: { _id: deletedUser._id , username: deletedUser.username, email: deletedUser.email } });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("user not deleted, try again");
    });
};
module.exports = {getUsers, getUserById, register,login, logout, updateUser, deleteUser }



