const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connect');

const PaymentModel = sequelize.define('payments', {
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:'users',
            key:'id'
        }
    },
    projectId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    paymentId: {
        type: DataTypes.STRING,
    }
});

module.exports = PaymentModel;
