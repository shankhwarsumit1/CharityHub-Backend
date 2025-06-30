const bcrypt = require('bcrypt');
const validator = require('validator');
const {CharityProjectModel,DonationModal}=require('../models/index')

const EditProfile = async(req,res)=>{
    try{
         const allowedEdit = ['name','mobileNumber','password'];
         if(!Object.keys(req.body).every(data=>allowedEdit.includes(data))){
               return res.status(400).json({success:false,message:'invalid edit field'})
         }
        const {name,mobileNumber,password} = req.body; 
        const loggedInUser = req.user;
        if(name){
            loggedInUser.name= name;
        }
        if(mobileNumber){
            if (!validator.isMobilePhone(mobileNumber)) {
         return res.status(400).json({ success: false, message: 'Invalid mobile number' });
           }
            loggedInUser.mobileNumber=mobileNumber
        }
        if(password){
           const hashpassword = await bcrypt.hash(password,10);
           loggedInUser.password = hashpassword;
        }
        await loggedInUser.save();
        res.status(200).json({success:true,message:`${loggedInUser.name} your profile is successfully updated`});
    }
    catch(err){
        console.log(err);
        res.status(500).json({'ERROR':err.message})
    }
}

const getProfile = async(req,res)=>{
    try{
       const user=req.user;
       const {name, mobileNumber, email, role} = req.user;
         const data = {};
        data.user = {name,mobileNumber,email,role};
        if (user.role === 'charity') {
            const charityProjects = await CharityProjectModel.findAll({
                where: {
                    userId: user.id
                },
                attributes: ['id','projectName', 'status', 'beneficiaryType', 'beneficiaryName', 'about', 'fundGoal','fundsRecieved']
            })
            data.charityProjects = charityProjects;
        } else if (user.role === 'donar') {
            const donations = await DonationModal.findAll({
                where: {
                    userId: user.id
                }
            })
            data.donations = donations;
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ERROR: err.message
        });
    }
}

module.exports={EditProfile,getProfile}