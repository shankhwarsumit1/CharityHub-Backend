const UserModel = require("../models/UserModel");
const CharityProjectsModel = require('../models/CharityProjectModel');
const DonationModal = require('../models/DonationModal');
const {Op} = require('sequelize');
const {filterByRange} = require('../utils/filter');
const {
    validatePageInfo,
    validateStatus,
    validateRange
} = require("../utils/validator");

const getAllusersByRole = async (req, res) => {
    try {
        const {
            role,
            page,
            name,
            range
        } = req.query;
        const pageNo = parseInt(page);
        const limit = parseInt(req.query.limit);
        validatePageInfo(pageNo, limit)
        const offset = (pageNo - 1) * limit;
        const where = {};
        if (role) {
            where.role = role
        }
        if (range) {
            validateRange(range);
            filterByRange(where, range);
        }
        if (name) {
            where.name = {
                [Op.like]: `%${name}%`
            }
        }
        const users = await UserModel.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            where
        });
        if (users.count === 0) {
            return res.status(404).json({
                message: 'no user found'
            });
        }
        const totalPages = Math.ceil(users.count / limit);

        res.status(200).json({
            success: true,
            data: {
                'totalItems': users.count,
                'totalPages': totalPages,
                'hasPreviousPage': pageNo > 1,
                'previousPage': pageNo > 1 ? pageNo - 1 : null,
                'limit': limit,
                'currentPage': pageNo,
                'content': users.rows
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const user = await UserModel.findOne({
            attributes: ['name', 'mobileNumber', 'email', 'role'],
            where: {
                id
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            });
        }
        const data = {};
        data.user = user.get({
            plain: true
        });
        if (user.role === 'charity') {
            const charityProjects = await CharityProjectsModel.findAll({
                where: {
                    userId: id
                },
                attributes: ['id','projectName', 'status', 'beneficiaryType', 'beneficiaryName', 'about', 'fundGoal','fundsRecieved']
            })
            data.charityProjects = charityProjects;
        } else if (user.role === 'donar') {
            const donations = await DonationModal.findAll({
                where: {
                    userId: id
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

const getallProjects = async (req, res) => {
    try {
        const {
            page,
            range,
            status,
            name,
            userId
        } = req.query;
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
        const projects = await CharityProjectsModel.findAndCountAll({
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

const reviewProject = async (req, res) => {
    try {
        const { projectId} = req.params;
        const {status} = req.body;

        const allowedStatus = ['accepted', 'rejected']

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "invalid status,it must be rejected or accepted"
            });
        }

        const project = await CharityProjectsModel.findByPk(projectId);

        if (!project) {
            return res.status(404).json({  message: 'project not found'  });
        }

        project.status = status;

        await project.save();
        res.status(200).json({message:`admin successfully reviewd the '${project.projectName}' project to '${status}'`})
    } catch (err) {
        console.log(err);
        res.status(500).json({
            "ERROR": err.message
        });
    }
}

module.exports = {
    getAllusersByRole,
    getUserById,
    getallProjects,
    reviewProject
};