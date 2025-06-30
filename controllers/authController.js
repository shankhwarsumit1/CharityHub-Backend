const {
    validateSignupData
} = require("../utils/validator");
const bcrypt = require('bcrypt');
const validator = require('validator')
const UserModel = require('../models//UserModel');

const signup = async (req, res) => {
    try {
        validateSignupData(req);
        const {
            name,
            email,
            mobileNumber,
            password,
            role
        } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);
        const data = await UserModel.create({
            name,
            email,
            mobileNumber,
            password: hashpassword,
            role
        });
        res.status(201).json({
            success: true,
            msg: 'successfull registration..!'
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            'error': err.message
        });
    }
}

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'must enter email and password'
            });
        }
        if (!validator.isEmail(email)) {
            throw new Error('plz enter valid email');
        }

        const user = await UserModel.findOne({
            where:{email:email}
        });
        console.log(user,email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }

        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) {
            return res.status(404).json({
                success: false,
                message: 'invalid password'
            });
        }
        userData = {
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role
        }
        const token = await user.getJWT();
       
        res.status(200).json({
            success: true,
            message: `${user.name} you are successfully logged In`,
            userData,
            token
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            ERROR: err.message
        });
    }
}


module.exports = {
    signup,
    login
};