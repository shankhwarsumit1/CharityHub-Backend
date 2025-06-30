const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DBNAME,process.env.DBUSERNAME,process.env.DBPASSWORD,{
    host:process.env.DBHOST,
    dialect:'mysql'
});

(async()=>{
    try{
           await sequelize.authenticate();
           console.log('db connected successfully');
    }
    catch(err){
        console.log(err);
    }
})();

module.exports=sequelize;