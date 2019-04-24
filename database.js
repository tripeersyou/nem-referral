const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: true
});

// Import schema
let companyModel = require('./models/company');
let userModel = require('./models/user');
let listingModel = require('./models/listing');
let connectionModel = require('./models/connection');
let referralModel = require('./models/referral');
let followModel = require('./models/follow');
// Create models
const User = userModel(sequelize, Sequelize);
const Company = companyModel(sequelize, Sequelize);
const Listing = listingModel(sequelize, Sequelize);
const Connection = connectionModel(sequelize, Sequelize);
const Referral = referralModel(sequelize, Sequelize)
const Follow = followModel(sequelize, Sequelize);

Connection.belongsTo(User, {as: 'firstUser', foreignkey: 'firstUserId', onDelete: 'CASCADE'});
Connection.belongsTo(User, {as: 'secondUser', foreignkey: 'secondUserId', onDelete: 'CASCADE'});
User.hasMany(Follow,{onDelete: 'CASCADE'});
Company.hasMany(Follow,{onDelete: 'CASCADE'});
Company.hasMany(Listing,{onDelete: 'CASCADE'});
Listing.belongsTo(Company, {onDelete: 'CASCADE'});
Listing.hasMany(Referral,{onDelete: 'CASCADE'});
Referral.belongsTo(Listing,{onDelete: 'CASCADE'});
Referral.belongsTo(User, {as: 'referrer', foreignkey: 'referrerId', onDelete: 'CASCADE'});
Referral.belongsTo(User, {as: 'referred', foreignkey: 'referredId', onDelete: 'CASCADE'});
User.hasMany(Referral, {as: 'referrer', foreignkey: 'referrerId', onDelete: 'CASCADE'});
User.hasMany(Referral, {as: 'referred', foreignkey: 'referredId', onDelete: 'CASCADE'});
sequelize.sync();

module.exports = {
    User,
    Company,
    Listing,
    Connection,
    Referral,
    Follow,
    Sequelize,
    sequelize
};