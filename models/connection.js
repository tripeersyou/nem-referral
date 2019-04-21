const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: true
});
const User = require('./user')(sequelize, Sequelize);
module.exports = (sequelize, type) => {
    return sequelize.define('connection',{
        accepted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    })
};