const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: true
});
const User = require('./user')(sequelize, Sequelize);
const Listing = require('./listing')(sequelize, Sequelize);
module.exports = (sequelize, type) => {
    return sequelize.define('referral',{
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        accepted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fee: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        blockHeight: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        transactionHash: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });
};