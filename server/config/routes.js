var controllers = require('../controllers');

module.exports = function(app){
    //add product to mongoDB
    //app.post('/api/products/', controllers.products.createProduct);

    //add product to mongoDB and save image to the gridFS
    app.post('/upload_image', controllers.products.createProduct);



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

    //Servicing Angular Routs
    app.get('/home',function(req,res){
        res.render('../../public/app/home');
    });

    app.get('/p/:partialArea/:partialName', function(req,res) {
        res.render('../../public/app/' + req.params.partialArea + '/' + req.params.partialName)

    });

    app.get('*',function(req,res){
        res.render('index');

    });
};