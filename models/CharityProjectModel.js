const {
    DataTypes
} = require('sequelize');
const sequelize = require('../utils/db-connect');

const CharityProjectModel = sequelize.define('charityProjects', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { 
            len: {
                args: [4, 100],
                msg: 'plz enter valid length project name'
            }
        },
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    status:{
          type:DataTypes.ENUM('pending','accepted','rejected'),
          defaultValue:'pending'
    },
    beneficiaryType: {
        type: DataTypes.ENUM('self', 'others'),
        allowNull: false
    },
    beneficiaryName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [4, 100],
                msg: 'plz enter valid length charity name'
            }
        },
    },
    about:{
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: {
                args: [4, 500],
                msg: 'words limit not valid in about'
            }
        },
    },
    fundGoal:{
        type:DataTypes.FLOAT,
        validate:{
            isNumeric:{msg:'fund must be numberic value'}
        },
        allowNull:false
    },
    fundsRecieved:{
        type:DataTypes.FLOAT,
        validate:{
            isNumeric:{msg:'fund must be numberic value'}
        },
        allowNull:false,
        defaultValue:'0'
    }
});

module.exports= CharityProjectModel;