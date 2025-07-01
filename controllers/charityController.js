const {
    validateCharityRegistrationData,
    validateProjectUpdateData
} = require('../utils/validator');
const { UserModel,CharityProjectModel} = require('../models');

const projectRegistration = async (req, res) => {
    try {
        validateCharityRegistrationData(req);
        const loggedInUser = req.user;
        if (loggedInUser.role != 'charity') {
            return res.status(400).json({
                message: 'only charities can add a project'
            })
        }

        const {
            projectName,
            beneficiaryType,
            beneficiaryName,
            about,
            fundGoal
        } = req.body;

        const charity = await CharityProjectModel.create({
            projectName,
            beneficiaryType,
            beneficiaryName,
            about,
            fundGoal,
            userId: loggedInUser.id
        });
        res.status(201).json({
            success: true,
            message: 'successfull registration of chartity',
            charity
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ERROR: err.message
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const {
            projectId
        } = req.params;
        const project = await CharityProjectModel.findOne({
            where: {
                id: projectId
            },
            attributes: [
                'id',
                'projectName',
                'status',
                'fundGoal',
                'about',
                'beneficiaryName',
                'beneficiaryType',
                'fundsRecieved'],
            include:[
                {
                    model:UserModel,
                    attributes:['id','name','email','role']
                }
            ]
        });

        if (!project) {
            return res.status(404).json({
                message: 'project not found'
            });
        }

        res.status(200).json({"success":"true",project});
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            'ERROR': err.message
        });
    }
}

const updateProject = async(req,res)=>{
    try {
        const {projectId} = req.params;
        loggedInUser= req.user;
        validateProjectUpdateData(req);
        const project = await CharityProjectModel.findByPk(projectId);
        if(!project){
           return res.status(404).json({message:'project not found'});
        }        
       
        //validating owner
        if(project.userId!==loggedInUser.id){
            return res.status(401).json({message:'unothorized to update this project'});
        }


        Object.keys(req.body).forEach(key=>{
            project[key]=req.body[key]
        })

        await project.save();

        res.status(200).json({message:'project details are updated successfully',
                              project})
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            'ERROR': err.message
        });
    }
}

module.exports = {
    projectRegistration,getProjectById,updateProject
};