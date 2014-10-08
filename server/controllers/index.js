var productsController = require('../controllers/productsController')
    ,searchController = require('../controllers/searchController')
    ,usersController = require('../controllers/usersController')
    ;

module.exports = {
    products: productsController
    ,search: searchController
    ,users: usersController
};