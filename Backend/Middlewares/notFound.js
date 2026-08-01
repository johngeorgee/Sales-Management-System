const app = require("../app");

const notFound = function(request, response, next){
 response.status(404).send({ message : "Route is Not found"})
} 
module.exports = { notFound }