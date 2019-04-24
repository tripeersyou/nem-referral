const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    Company,
    User,
    Sequelize,
    Referral,
    Connection,
    Listing,
} = require('../database');
const company = require('../util/verifyCompany');
const user = require('../util/verifyUser');
const session = require('../util/verifyAuth');
const nem = require('../nem');
const sdk = require("nem-sdk").default;

router.get('/', session.authenticate, (req, res) => {
    console.log(req.user);
    if (req._passport.session.user.type === 'company') {
        res.render('listings/index', {
            type: 'company',
            user: req.user.dataValues,
            listings: req.user.dataValues.listings
        });
    } else {
        Listing.findAll().then(listings => {
            res.render('listings/index', {
                type: 'user',
                user: req.user.dataValues,
                listings: listings
            })
        });
    }
});

router.get('/new', company.authenticate, (req, res) => {
    res.render('listings/new', {
        type: 'company',
        user: req.user.dataValues
    })
});

router.post('/new', company.authenticate, (req, res) => {
    Listing.create(req.body).then(listing => {
        res.redirect('/listings');
    })
})
router.get('/:id', session.authenticate, (req, res) => {
    if (req._passport.session.user.type === 'company') {
        Listing.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                all: true,
                nested: true
            }]
        }).then(listing => {
            console.dir(listing);
            res.render('listings/show', {
                listing: listing,
                type: req._passport.session.user.type,
                user: req.user.dataValues
            });
        });
    } else {
        Listing.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                all: true,
                nested: true
            }]
        }).then(listing => {
            console.dir(listing);
            res.render('listings/show', {
                listing: listing,
                type: req._passport.session.user.type,
                user: req.user.dataValues
            });
        });
    }
})

router.get('/:id/new', user.authenticate, (req, res) => {
    Listing.findOne({
        where: {
            id: req.params.id
        }
    }).then(listing => {
        Connection.findAll({
            where: {
                [Sequelize.Op.or]: [{
                    firstUserId: req.user.dataValues.id
                }, {
                    secondUserId: req.user.dataValues.id
                }]
            },
            include: [{
                all: true,
                nested: true
            }]
        }).then((connections) => {
            res.render('listings/new_referral', {
                type: 'user',
                user: req.user.dataValues,
                listing: listing,
                connections: connections
            });
        });
    });
});

router.post('/:id/new', user.authenticate, (req, res) => {
    Referral.create(req.body).then(referral => {
        res.redirect('/listings')
    });
});

router.post('/:id/close', company.authenticate, (req, res) => {
    Listing.findOne({
        where: {
            id: req.params.id
        }
    }).then(listing => {
        if (listing.status) {
            listing.status = false;
            listing.save().then(() => {
                res.redirect('/listings');
            });
        }
        res.redirect('/listings');
    });
});

router.get('/:listing_id/referral/:id', session.authenticate, (req, res) => {
    Referral.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            all: true,
            nested: true
        }]
    }).then(referral => {
        if (req._passport.session.user.type == 'company') {
            res.render('referrals/show', {
                referral: referral,
                type: 'company',
                user: req.user.dataValues
            });
        } else {
            res.render('referrals/show', {
                referral: referral,
                type: 'user',
                user: req.user.dataValues
            });
        }
    })
});

router.get('/:listing_id/referral/:id/accept', company.authenticate, (req, res) => {
    Referral.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            all: true,
            nested: true
        }]
    }).then(referral => {
        res.render('referrals/accept', {
            referral: referral,
            type: 'company',
            user: req.user.dataValues
        });
    });
});

router.post('/:listing_id/referral/:id/accept', company.authenticate, (req, res) => {
    Referral.findOne({
        where: {
            id: req.params.id
        }
    }).then(referral => {
        let transactionEntity = nem.getEntity(req.body.privateKey, referral.amount, req.body.receipientAddress);
        const endpoint = sdk.model.objects.create("endpoint")(sdk.model.nodes.defaultTestnet, sdk.model.nodes.defaultPort);
        sdk.com.requests.chain.time(endpoint).then(function (timeStamp) {
            const common = sdk.model.objects.create("common")("", req.body.privateKey);
            const ts = Math.floor(timeStamp.receiveTimeStamp / 1000);
            transactionEntity.timeStamp = ts;
            const due = 60;
            transactionEntity.deadline = ts + due * 60;
            sdk.model.transactions.send(common, transactionEntity, endpoint).then(function(response){
                console.log(response);
                referral.accepted = true;
                referral.transactionHash = response.transactionHash.data
                res.json(transactionEntity);
            }, function(err){
                console.log(err);
                res.redirect('/');
            });
        }, function (err) {
            console.log(err);
            res.redirect('/');
        });
    });
});

module.exports = router;