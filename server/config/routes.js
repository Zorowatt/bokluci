var controllers = require('../controllers')
    ;

module.exports = function(app){

    //user login
    app.post('/login', controllers.users.userAuth);
    //user logout
    app.post('/logout', controllers.users.userLogout);
    //user signUp
    app.post('/signup', controllers.users.createUser);

    //add product to mongoDB and save image to the gridFS
    app.post('/upload_image', controllers.products.createProduct);

//    ,
//    function (req,res,next) {
//        if (!req.isAuthenticated()) {
////            res.status(403);
////            res.end();
//        }else{
//            next();
//        }
//    }

    //TODO hints during search
    app.get('/api/search', controllers.search.searchSuggestions);

    //shows all products
    app.get('/api', controllers.products.getAllProducts);
    //get the image from gridFS
    app.get('/get_image/:id', controllers.products.getImage);


    //update after comment added
    app.post('/api/update/', controllers.products.updateProduct);

    //shows selected product
    app.get('/api/product/:id', controllers.products.getProductById);

    //Servicing Angular Routes
    app.get('/home',function(req,res){
        res.render('../../public/app/home');
    });

    app.get('/p/:partialArea/:partialName', function(req,res) {
        res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName)

    });

    app.get('*',function(req,res){
        //the second part is added if refresh the page the browser to know that the user is all ready logged in
        if (req.user) {
            //sends only username, not the entire user
            res.render('index',{currentUser: {username: req.user.username} } );
        }
        else{
            res.render('index');
        }

    });
};