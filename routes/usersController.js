const express = require('express');
const router = express.Router();
const passport = require('passport');
const {User} = require('../database');
const bcrypt = require('bcrypt-nodejs');
const session = require('../util/verifyUser');

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

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;