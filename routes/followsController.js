const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../util/verifyUser');
const {
    Follow,
    Sequelize,
    User
} = require('../database');

