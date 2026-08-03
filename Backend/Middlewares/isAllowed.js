const { roleModel } = require("../Models/role.model")
const { userModel } = require("../Models/users.model")

const checkPermissions = function (permission){
    return async (req, res, next) =>{
        try {
            const user = req.user;
            if(!user || !user.id){
                return res.status(401).send("Unauthorized")
            }
            const userId = user.id;
            
            const foundUser = await userModel.findById(userId).populate("roleId")
            if(!foundUser){
                return res.status(404).send("Cannot find this user")
            }
            const roleId = foundUser.roleId;
            const role = await roleModel.findById(roleId)
            if(!role){
                return res.status(403).send("User Role Not Found")
            }
            if(!role.permissions.includes(permission)){
                 return res.status(403).json({
                message: "Forbidden. You don't have permission to perform this action"
                });
            }

            req.userRole = role;
            next();
        } catch (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Authorization error"
                });  
        }
    }
}

module.exports = { checkPermissions };