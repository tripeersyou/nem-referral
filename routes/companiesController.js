const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    Company,
    User,
    Sequelize,
    Follow,
} = require('../database');

const bcrypt = require('bcrypt-nodejs');
const company = require('../util/verifyCompany');
const user = require('../util/verifyUser');
const session = require('../util/verifyAuth');


router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('companies/sign_in', {
            user: null,
            type: null
        })
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/login', passport.authenticate('company', {
    successRedirect: '/',
    failureRedirect: '/companies/login',
    failureFlash: false
}));

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('companies/sign_up', {
            user: null,
            type: null
        })
    }
});

router.post('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        let company = req.body;
        company.password = bcrypt.hashSync(company.password);
        Company.create(company).then(() => {
            res.redirect('/companies/login');
        });
    }
});

router.post('/follow', user.authenticate, (req, res) => {
    Follow.create(req.body).then((follow) => {
        res.redirect(`/companies/${req.body.companyId}`);
    });
});

router.get('/show', session.authenticate, (req, res) => {
    Company.findAll().then(companies => {
        res.render('companies/index', {
            type: 'user',
            companies: companies,
            user: req.user.dataValues
        })
    });
});

router.get('/:id', session.authenticate, (req, res) => {
    Company.findOne({
        where: {
            id: req.params.id
        },include: [{
            all: true,
            nested: true
        }]
    }).then(company => {
        if(req._passport.session.user.type === 'company'){
            res.render('companies/show', {
                type: 'company',
                company: company,
                user: req.user.dataValues
            })
        } else {
            res.render('companies/show', {
                type: 'user',
                company: company,
                user: req.user.dataValues
            })
        }
    });
});
module.exports = router;