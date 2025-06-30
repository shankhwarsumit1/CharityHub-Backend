const UserModel = require('./UserModel');
const CharityProjectModel = require('./CharityProjectModel');
const DonationModal = require('./DonationModal');
const PaymentModel = require('./PaymentModel');

UserModel.hasMany(CharityProjectModel,{foreignKey:'userId'});
CharityProjectModel.belongsTo(UserModel,{foreignKey:'userId'});

CharityProjectModel.hasMany(DonationModal,{foreignKey:'projectId'});
DonationModal.belongsTo(CharityProjectModel,{foreignKey:'projectId'});

UserModel.hasMany(DonationModal,{foreignKey:'userId'});
DonationModal.belongsTo(UserModel,{foreignKey:'userId'});

UserModel.hasMany(PaymentModel,{foreignKey:'userId'});
PaymentModel.belongsTo(UserModel,{foreignKey:'userId'});

module.exports={UserModel,CharityProjectModel,DonationModal}