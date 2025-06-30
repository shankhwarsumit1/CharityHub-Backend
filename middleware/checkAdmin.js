const authorizeAdmin = (req,res,next)=>{
    const loggedInUser = req.user;
    if(loggedInUser.role!='admin'){
        return res.status(403).json({message:'forbidden: admins only'});
    }
    else{
        next();
    }
}

module.exports = authorizeAdmin;