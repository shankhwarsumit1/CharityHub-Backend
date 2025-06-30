const jwt = require('jsonwebtoken');
const SECRETKEY = process.env.SECRETKEY;
const UserModel = require('../models/UserModel');

const authenticate = async(req,res,next)=>{
    try{
         const token = req.headers.token;
         if(!token){
            return res.status(401).json({message:'token not found'})
         }
         const data = await jwt.verify(token,SECRETKEY);
         const {id} = data
         const user = await UserModel.findByPk(id);
         if(!user){
            throw new Error('invalid user');
         }
         console.log(user);
         req.user = user;
         
         next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({ERROR:err.message});
    }
}

module.exports = authenticate;