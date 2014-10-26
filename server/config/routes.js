var controllers = require('../controllers')
    ,auth = require('./auth')
    ;

module.exports = function(app){



    //user login
    app.post('/login', auth.userLogin);
    //user logout
    app.post('/logout', auth.userLogout);


    //user signUp
    app.post('/signup', controllers.users.createUser);
    //this comes from email verification link
    app.get('/verify',controllers.users.verifyUser);
    app.post('/fpass',controllers.users.forgotUser);
    //this comes from email verification link
    app.get('/recover',controllers.users.recoverUser);
    app.post('/recover',controllers.users.verifyAndRecoverUser);


    //add product to mongoDB and save image to the gridFS
    app.post('/upload_image'
        //, auth.isAuthenticated
        , controllers.products.createProduct);


    //TODO hints during search
    app.get('/api/search', controllers.search.searchSuggestions);

    //shows all products
    app.get('/api', controllers.products.getAllProducts);
    //get the image or thumbnail from gridFS
    app.get('/get_image/:id', controllers.products.getImage);


    //update after comment added
    app.post('/api/update/', auth.isAuthenticated, controllers.products.updateProduct);

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