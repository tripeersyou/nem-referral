const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const {
    User,
    Company
} = require('../database');

const localAuthFields = {
    usernameField: 'email',
    passwordField: 'password',
};

passport.use('user', new LocalStrategy(localAuthFields, (email, password, done) => {
    User.scope('withPassword').findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (!user) {
            return done(null, false, {
                message: `No user with the email of ${email}`
            });
        }
        if (bcrypt.compareSync(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, {
                message: 'Invalid password'
            });
        }
    }).catch(err => {
        done(err);
    })
}));

passport.use('company', new LocalStrategy(localAuthFields, (email, password, done) => {
    Company.scope('withPassword').findOne({
        where: {
            email: email
        }
    }).then((company) => {
        if (!company) {
            return done(null, false, {
                message: `No company with the email of ${email}`
            });
        }
        if (bcrypt.compareSync(password, company.password)) {
            return done(null, company);
        } else {
            return done(null, {
                message: 'Invalid password'
            });
        }
    }).catch(err => {
        done(err);
    })
}));


passport.serializeUser((data, done) => {
    let type = data._modelOptions.name.singular;
    done(null, {
        id: data.id,
        type: type
    });
});

passport.deserializeUser((data, done) => {
    if (data.type === 'user') {
        User.findOne({
            where: {
                id: data.id
            },
            include: [{
                all: true,
                nested: true
            }]
        }).then(user => {
            done(null, user)
        }).catch(err => {
            done(err, null);
        });
    } else {
        Company.findOne({
            where: {
                id: data.id
            },
            include: [{
                all: true,
                nested: true
            }]
        }).then(company => {
            done(null, company)
        }).catch(err => {
            done(err, null);
        });
    }
})