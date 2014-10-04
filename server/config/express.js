var express = require('express'),
bodyParser = require('body-parser');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = function(app){

    // This is to prevent hacker attack or at least to make their job more difficult
    app.disable('x-powered-by');

    app.set('view options',{layout:false});
    app.set('view engine','jade');
    app.set('views', rootPath + '/server/views');
//    app.use(bodyParser.urlencoded({
//        extended: true
//    }));
    app.use(bodyParser.json());
    app.use(express.static(rootPath+'/public'));
};