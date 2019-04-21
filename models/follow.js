const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: true
});
const User = require('./user')(sequelize, Sequelize);
const Company = require('./company')(sequelize, Sequelize);
module.exports = (sequelize, type) => {
    return sequelize.define('follow',{
    })
};