
const validator = require('validator');

const validateSignupData = (req) => {
    const {
        name,
        email,
        mobileNumber,
        password,
        role
    } = req.body;
    const validRoles = ['donor', 'charity'];
    if (!name) {
        throw new Error('Name is not valid');
    } else if (!validator.isEmail(email)) {
        throw new Error('email is not valid');
    } else if (!mobileNumber) {
        throw new Error('please enter valid mobile number');
    } else if (!password) {
        throw new Error('please enter strong password');
    } else if (!role) {
        throw new Error('please enter your role');
    } else if (!validRoles.includes(role)) {
        throw new Error('please enter a valid role');
    }
}

const validateCharityRegistrationData = (req) => {
    const {
        projectName,
        beneficiaryType,
        beneficiaryName,
        about,
        fundGoal
    } = req.body;
    const allowedBeneficiaryType = ['self', 'others'];
    if (!projectName) {
        throw new Error('plz enter valid projectName');
    } else if (!beneficiaryType) {
        throw new Error('plz enter valid beneficiary Type');
    } else if (!allowedBeneficiaryType.includes(beneficiaryType)) {
        throw new Error('plz enter valid beneficiary type');
    } else if (!beneficiaryName) {
        throw new Error('plz enter valid beneficiary Name');
    } else if (beneficiaryName.length > 100) {
        throw new Error('beneficiary Name length exceeded');
    } else if (!about) {
        throw new Error('plz enter valid about');
    } else if (about.length > 1000) {
        throw new Error('about word limit exceeded');
    } else if (!fundGoal) {
        throw new Error('plz enter valid fundGoal');
    } else if (!validator.isNumeric(fundGoal)) {
        throw new Error('fundGoal must be numeric');
    }
}

const validateProjectUpdateData = (req) => {
    const {
        projectName,
        beneficiaryType,
        beneficiaryName,
        about,
        fundGoal
    } = req.body;


    const allowedUpdates = ['projectName',
        'beneficiaryType',
        'beneficiaryName',
        'about',
        'fundGoal'];

    if(!Object.keys(req.body).every(key=>allowedUpdates.includes(key))){
        throw new Error('invalid update field')
    }

    const allowedBeneficiaryType = ['self', 'others'];
    if (projectName && projectName.length > 100) {
        throw new Error('projectName word limit exceeded');
    } else if (beneficiaryType && !allowedBeneficiaryType.includes(beneficiaryType)) {
        throw new Error('plz enter valid beneficiary type');
    } else if (beneficiaryName && beneficiaryName.length > 100) {
        throw new Error('beneficiary Name word limit exceeded');
    } else if (about && about.length > 1000) {
        throw new Error('about word limit exceeded');
    } else if (fundGoal && !validator.isNumeric(fundGoal)) {
        throw new Error('fundGoal must be numeric');
    }
}


const validatePageInfo = (pageNo, limit) => {
    if (isNaN(pageNo) || pageNo < 1) {
        throw new Error('Please enter valid page number')
    } else if (isNaN(limit) || limit < 1) {
        throw new Error('Please enter valid limit')
    }
}

const validateStatus = (status) => {
    const allowedstatus = ['pending', 'accepted', 'rejected'];
    if (!allowedstatus.includes(status)) {
        throw new Error('status is not valid');
    }
}

const validateRange = (range) => {
    const allowedrange = ['daily', 'weekly', 'monthly'];
    if (!allowedrange.includes(range)) {
        throw new Error('range is not valid');
    }
}

module.exports = {
    validateSignupData,
    validateCharityRegistrationData,
    validatePageInfo,
    validateStatus,
    validateRange,
    validateProjectUpdateData
};