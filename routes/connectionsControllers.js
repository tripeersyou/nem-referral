const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../util/verifyUser');
const {
    Connection,
    Sequelize,
    User
} = require('../database');

router.get('/', user.authenticate, (req, res) => {
    let currentUserId = req.user.dataValues.id;
    User.findAll({
        where: {
            id: {
                [Sequelize.Op.not]: [currentUserId]
            }
        },
        include: [{
            all: true,
            nested: true
        }]
    }).then(users => {
        Connection.findAll({
            where: {
                [Sequelize.Op.or]: [{
                    firstUserId: currentUserId
                }, {
                    secondUserId: currentUserId
                }]
            },
            include: [{
                all: true,
                nested: true
            }]
        }).then(connections => {
            res.render('connections/index', {
                users: users,
                user: req.user.dataValues,
                type: 'user',
                connections: connections
            });
        })
    })
});

router.post('/invite', user.authenticate, (req, res) => {
    Connection.create(req.body).then((connection) => {
        res.redirect('/connections');
    });
});

router.get('/invite', user.authenticate, (req, res) => {
    let currentUserId = req.user.dataValues.id;
    Connection.findAll({
        where: {
            secondUserId: currentUserId,
            accepted: false
        },
        include: [{
            all: true,
            nested: true
        }]
    }).then(connections => {
        res.render('connections/invite', {
            type: 'user',
            user: req.user.dataValues,
            invites: connections
        });
        // res.json(connections);
    });
});

router.post('/invite/accept', user.authenticate, (req, res) => {
    Connection.findOne({
        where: {
            id: req.body.id
        }
    }).then(connection => {
        connection.accepted = true;
        connection.save().then(() => {
            res.redirect('/connections');
        });
    })
});

router.post('/invite/reject', user.authenticate, (req, res) => {
    Connection.findOne({
        where: {
            id: req.body.id
        }
    }).then(connection => {
        connection.destroy().then(() => {
            res.redirect('/connections');
        });
    })
});

module.exports = router;