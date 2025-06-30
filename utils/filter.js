const {
    Op
} = require('sequelize');

const filterByRange = (where, range) => {
    const nowDate = new Date();
    if (range === 'daily') {
        const startDate = new Date(nowDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(nowDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt = {
            [Op.between]: [startDate, endDate]
        };
    } else if (range === 'weekly') {
        const startDate = new Date(nowDate);
        startDate.setDate(nowDate.getDate() - nowDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(nowDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt = {
            [Op.between]: [startDate, endDate]
        };
    } else if (range === 'monthly') {
        const startDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt = {
            [Op.between]: [startDate, endDate]
        };
    }

}

module.exports = {
    filterByRange
};