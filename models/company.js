const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('company',{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        companyName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              isEmail: true,
            },
            unique: {
              args: true,
              msg: 'This email is already registered!',
            },
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'This NEM address is already registered!',
            }
        }
    },{
        defaultScope: {
            attributes: {
                exclude: ['password']
            },
        },
        scopes: {
            withPassword: {
                attributes: {},
            }
        }
    })
}