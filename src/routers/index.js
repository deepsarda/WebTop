let express = require('express');

module.exports=function(app,renderTemplate){

    let router = express.Router();

    router.get('/', function (req, res) {
        renderTemplate(res, req, 'index.ejs');
    });

    router.get('/login', function (req, res) {
        renderTemplate(res, req, 'login.ejs');
    });

    router.get('/features', function (req, res) {
        renderTemplate(res, req, 'features.ejs');
    });

    router.get('/about', function (req, res) {
        renderTemplate(res, req, 'about.ejs');
    });
    
    return router;
}