var mongoose = require('mongoose')
    ,products = require('../models/Products')
    ,users = require('../models/Users')
    ,searchbuffer = require('../models/SearchBuffer')
    ,images = require('../models/Images')
    ;

module.exports = function(){
    mongoose.connect('mongodb://adminzoro:jagarajugara@ds033380.mongolab.com:33380/bokluci_database');
    var db = mongoose.connection;
    db.once('open',function(err){
        if (err){
            console.log('Database cannot be opened: ' + err);
            return;
        }
        console.log('Database up and running ...');
    });
    db.on('error',function(err){
        console.log('Database error: ' + err);
    });

//    products.seedInitialProducts();
    //TODO CAUTION uncomment will cause: 1. remove all user from DB; 2. add initial users
//    users.seedInitialUsers();
};
