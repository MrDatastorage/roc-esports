const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const oauth2 = require('../lib/oauth2');

// Use the oauth middleware to automatically get the user's profile
// information and expose login/logout URLs to templates.
router.use(oauth2.template);

function getModel() {
    return require(`../data/model-${require('../config').get('DATA_BACKEND')}`); // zie voorbeeld Google
    // return require('../data/model-datastore'); // doet hetzelfde
}

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({extended: false}));

/* GET admin page. */
router.get('/',oauth2.required, function (req, res, next) {

    // how many entities are being loaded
    let nAdmins = 10;
    getModel().listAdmins(nAdmins, req.query.pageToken, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }

        res.render('admin', {
            title: 'roc-dev esports',
            admins: entities
        });
    });
});


// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

//add admin to datastore
router.post('/createadmin', function (req, res, next) {
    const data = req.body;
    getModel().createAdmin(data, (err, savedData) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect("/admin");
    });
});


module.exports = router;
