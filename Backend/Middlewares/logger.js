function isLogged(req,res, next){

    
    console.log(req.url);
    console.log(req.method);

    next() 
}

module.exports = { isLogged }