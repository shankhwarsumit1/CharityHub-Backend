const bcrypt = require('bcrypt');
const validator = require('validator');
const {validatePageInfo,validateRange,validateStatus} = require('../utils/validator');
const {filterByRange}  = require('../utils/filter');
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

const getMyDonations = async(req,res)=>{
    try {const donor = req.user;
         const donorId = req.user.id;
         const page = parseInt(req.query.page);
         const limit = parseInt(req.query.limit);
         const range = req.query.range;

         if(donor.role!=='donor'){
            return res.status(404).json({
                message: "you are not donor"
            });
         }
         validatePageInfo(page,limit);
         const offset = (page-1)*limit;

          const where = {};
          where.userId=donorId;
        
        if (range) {
            validateRange(range);
            filterByRange(where, range);
        }


         const donations = await DonationModal.findAndCountAll({
            limit,offset,
            where,
            include:[{
                model:CharityProjectModel,
                attributes:['projectName','about','fundGoal','fundsRecieved']
            }],
            order:[['createdAt','DESC']]
         })
         const totalItems = donations.count;
         if(totalItems===0){
             return res.status(404).json({
                message: "no donations found"
            });
         }

         const totalPages = Math.ceil(totalItems/limit);
         const previousPage = page>1?page-1:null;
         return res.status(200).json({
            totalItems,
            totalPages,
            hasPreviousPage:page>1,
            hasNextPage:page<totalPages,
            previousPage,
            content:donations.rows
         })
    }
    catch(err){
        console.log(err);
        res.status(500).json({'ERROR':err.message});
    }
}

const getMyProjects = async (req, res) => {
    try {
        const {
            page,
            range,
            status,
            name } = req.query;
        const user = req.user;
         if(user.role!=='charity'){
            return res.status(404).json({
                message: "you are not charity"
            });
         };
        const userId = req.user.id;
        const pageNo = parseInt(page);
        const limit = parseInt(req.query.limit);
        validatePageInfo(pageNo, limit)
        const offset = (pageNo - 1) * limit;
        const where = {};
        if (status) {
            validateStatus(status);
            where.status = status;
        }

        if (name) {
            where.projectName = {
                [Op.like]: `%${name}%`
            };
        }

        if (range) {
            validateRange(range);
            filterByRange(where, range);
        }

        if (userId) {
            where.userId = userId;
        }
        const projects = await CharityProjectModel.findAndCountAll({
            where,
            limit,
            offset,
            attributes: ['id', 'projectName', 'status', 'fundGoal', 'about', 'beneficiaryName','fundsRecieved']
        });
        if (projects.count === 0) {
            return res.status(404).json({
                message: 'no project found'
            });
        }
        const totalPages = Math.ceil(projects.count / limit);

        res.status(200).json({
            success: true,
            data: {
                'totalItems': projects.count,
                'totalPages': totalPages,
                'hasPreviousPage': pageNo > 1,
                'previousPage': pageNo > 1 ? pageNo - 1 : null,
                'limit': limit,
                'currentPage': pageNo,
                'content': projects.rows
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            "ERROR": err.message
        });
    }
}

const downloadReceipt = async(req,res)=>{
    try{
          const {donationId} = req.params;
          const user = req.user;

         let donation = await DonationModal.findOne({
            where:{id:donationId},
            include:[
                {
                    model:CharityProjectModel,
                    attributes:['projectName','beneficiaryName']
                },   
            ]
          });
          
          if(!donation){
            return res.status(404).json({'msg':'donation not found incorrect donation id'})};

          if(donation.userId!==user.id){
             return res.status(404).json({'msg':'userId is not matching of donation'});
          }
        
          donation=donation.get({plain:true})
          console.log(donation.charityProject);
          
          const charityProject = donation.charityProject;
          const receiptText = `
          CharityHub Donation Receipt
            
          Donor:${user.name}
          Email:${user.email}
          CharityProjectName:${charityProject.projectName}
          BeneficiaryName:${charityProject.beneficiaryName}
          Amount:₹${donation.amount}
          Date:${donation.createdAt}
          Order ID:${donation.orderId}
          
          Thank you for supporting our mission`

          res.setHeader("Content-Disposition",`attachment; filename=receipt_${donation.id}`);
          res.setHeader("content-Type","text/plain");
          res.status(200).send(receiptText);
    }
    catch(err){
        console.log(err);
        res.status(500).json({'ERROR':err.message});
    }
}

module.exports={EditProfile,getProfile,getMyDonations,getMyProjects,downloadReceipt};