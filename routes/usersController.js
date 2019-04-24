const express = require('express');
const router = express.Router();
const passport = require('passport');
const {User} = require('../database');
const bcrypt = require('bcrypt-nodejs');
const session = require('../util/verifyAuth');
const user = require("../util/verifyUser");
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('users/sign_in',{
            user: null,
            type: null
        })
    }
});

router.post('/login', passport.authenticate('user', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: false
}));

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

router.get('/edit', user.authenticate, (req, res)=>{
    res.render('users/edit',{
        type: 'user',
        user: req.user.dataValues
    })
})

router.post('/update', user.authenticate, (req, res)=>{
    User.findOne({
        where: {
            id: req.user.dataValues.id
        }
    }).then(user =>{
        user.address = req.body.address
        user.save().then(()=>{
           res.redirect('/') 
        });
    })
})

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('users/sign_up',{
            user: null,
            type: null
        })
    }
});

router.post('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        let user = req.body;
        user.password = bcrypt.hashSync(user.password);
        User.create(user).then(()=>{
            res.redirect('/users/login');
        });
    }
});

router.get('/:id', session.authenticate,(req, res)=>{
    User.findOne({
        where : {
            id: req.params.id
        }
    }).then(user => {
        if (req._passport.session.user.type === 'company') {
            res.render('users/show',{
               user: req.user.dataValues,
               profile: user,
               type: 'company'
            });
        } else {
            res.render('users/show',{
               user: req.user.dataValues,
               profile: user,
               type: 'user'
            });
        }
    });
})

module.exports = router;