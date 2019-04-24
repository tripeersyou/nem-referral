require('dotenv').config();
// Express setup
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT;

// Passport dependencies
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const passportConfig = require('./config/passport');

const app = express();

// Middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Import routes
let usersController = require('./routes/usersController');
let pagesController = require('./routes/pagesController');
let companiesController = require('./routes/companiesController');
let connectionsController = require('./routes/connectionsControllers');
let listingsController = require('./routes/listingsController');
let referralsController = require('./routes/referralsController');
app.use('/', pagesController);
app.use('/users', usersController);
app.use('/companies', companiesController);
app.use('/connections', connectionsController);
app.use('/listings',listingsController);
app.use('/referrals', referralsController)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});