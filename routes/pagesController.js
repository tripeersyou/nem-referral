const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.user){
        res.render('pages/home', {
            user: req.user,
            type: req._passport.session.user.type
        });
    } else {
        res.render('pages/home', {
            user: null,
            type: null
        });
    }
});

module.exports = router;