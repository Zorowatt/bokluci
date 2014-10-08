var express = require('express')
    ,bodyParser = require('body-parser')
    ,cookieParser = require('cookie-parser')
    ,session = require('express-session')
    ,passport = require('passport')
    ,path = require('path')
    ,rootPath = path.normalize(__dirname + '/../../')
    ;

module.exports = function(app){

    // This is to prevent hacker attack or at least to make their job more difficult
    app.disable('x-powered-by');

    app.set('view options',{layout:false});
    app.set('view engine','jade');
    app.set('views', rootPath + '/server/views');

    app.use(cookieParser());

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(session({secret: 'zzzooorrrooo',
        saveUninitialized: true,
        resave: true}));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(rootPath+'/public'));
};