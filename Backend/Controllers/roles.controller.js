const { roleModel } = require("../Models/role.model")
const getRoles = ((req, res)=>{
    roleModel.find().then((roles)=>{
        res.status(200).json({
            message : "Roles Found Successfully",
            data  : roles,
        })
    }).catch( (error) =>{
        console.log(error);   
        res.status(500).json({
            message: "role not found "
        })
    }   
    )
})
const addRoles = ((req, res)=>{
    const data = req.body;
    roleModel.create(data).then(() => {
      res.status(201).json({ msg: "role added successfully", data: data});
}).catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "role not added , try again"
      });
    })
})

module.exports = {getRoles, addRoles}