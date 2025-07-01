SECRETKEY=process.env.SECRETKEY;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    DataTypes,
    DATE
} = require('sequelize');
const sequelize = require('../utils/db-connect');

const UserModel = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [2, 100],
                msg: 'name must between length 2 to 100'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail:{
            msg: 'email must be valid'}
        },
        unique: true,
        set(value) {
            this.setDataValue('email', value.trim().toLowerCase());
        }
    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: {
                msg: "phone number must be a numeric value"
            },
            len: {
                args: [10, 10],
                msg: 'phone number must be exactly 10 digits'
            }
        },

    },
    role:{
       type:DataTypes.ENUM('donor','admin','charity'),
       defaultValue:'donor',
       allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },

});

UserModel.prototype.getJWT=async function(){
     const token = await jwt.sign({id:this.id,name:this.name},SECRETKEY);
     return token;
}

UserModel.prototype.isPasswordValid= async function(userInputPassword){
    return bcrypt.compare(userInputPassword,this.password);
}

module.exports = UserModel;