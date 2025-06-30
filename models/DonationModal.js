const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connect');

const DonationModal = sequelize.define('donations',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'id'
        }
    },
    projectId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'charityProjects',
            key:'id'
        }
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

module.exports = DonationModal;