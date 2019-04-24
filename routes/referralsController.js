const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    Company,
    User,
    Sequelize,
    Follow,
    Referral
} = require('../database');
const user = require('../util/verifyUser');

router.get('/', user.authenticate, (req,res)=>{
    Referral.findAll({where: {
            referrerId: req.user.dataValues.id
     }, include: [{
                all: true,
                nested: true
            }]}).then(referrals =>{
        res.render('referrals/index',{
            type: 'user',
            referrals: referrals,
            user: req.user.dataValues
        });
    });
    
})

module.exports = router;