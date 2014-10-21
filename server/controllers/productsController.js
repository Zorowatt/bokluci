var Products = require('mongoose').model('Product')
    ,mongoose = require('mongoose')
    ,Grid = require('gridfs-stream')
    ,db = mongoose.connection
    ,gfs = Grid(db.db, mongoose.mongo)
    ,Busboy = require('busboy')
    ,fs = require('fs')
    ,lwip = require('lwip')
    //,stream = require('stream')
    ,stream = require('streamifier')
    ;

var randomFileName;
//creates randome string for the image name
function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz{}[]$^*";
    var string_length = 15;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}




module.exports = {

    getAllProducts: function(req, res, next) {
        if (req.query.l && req.query.s) {


            if (req.query.search.length == 0) {
                Products.find({flagIsNew: false}).sort({ id: 1 }).limit(req.query.l).skip(req.query.s).exec(function (err, collection) {
                    if (err) {
                        console.log('Products can not be loaded: ' + err);
                    }
                    res.send(collection);
                })
            }
            else {
                var findOptions = {flagIsNew: false, keyWords: {$in: [req.query.search]}};
                Products.find(findOptions).sort({ id: 1 }).limit(req.query.l).skip(req.query.s).exec(function (err, collection) {
                    if (err) {
                        console.log('Products can not be loaded: ' + err);
                    }
                    res.send(collection);
                })

            }
        }
        else{
            res.redirect('/');
        }
    },
    getImage: function(req, res, next) {
        //console.log(req.params.id);
        var readstream = gfs.createReadStream({
            filename: req.params.id,
            content_type: 'image/*'
        });
        readstream.on('error', function (err) {
            console.log('An error occurred!', err);
            throw err;
        });
        readstream.pipe(res);
    },
    getProductById: function(req, res, next){
        Products.findOne({ _id : req.params.id }).exec(function(err, document) {
            if (err) {
                console.log('Product can not be loaded: ' + err);
            }
            res.send(document);
        })

    },

    //adds Product and image to the mongoDB and gridFS
    createProduct: function(req, res, next) {
        var pictureExists = false;
        var busboy = new Busboy({ headers: req.headers });
        var prod = {};
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            pictureExists = true;
            var fileExt = filename.split('.').pop();
            if (fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'png'){
                pictureExists = false;
                return;
            }
            var bufs = [];
            file.on('data', function(d){ bufs.push(d); });
            file.on('end', function() {
                var buf = Buffer.concat(bufs);
                lwip.open(buf,fileExt, function(err, image){
                    image.batch()
                       // .scale(0.75)          // scale to 75%
                        .rotate(45, 'white')  // rotate 45degs clockwise (white fill)
                       // .crop(200)            // crop a 200X200 square from center
                       // .blur(5)              // Gaussian blur with SD=5
                        .toBuffer('jpg', function(err, buffer){
                            stream.createReadStream(buffer).pipe(gfs.createWriteStream({
                                filename: randomFileName
                                //       ,mode: 'w'
                            }));
                        });
                });
            });
        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
            //console.log('Field [' + fieldname + ']: value: ' + inspect(val));

            //this is to converts val/data from strings to real values(arrays, objects, ets.)
            try {
                prod[fieldname] = JSON.parse(val);
                //randomly generate picture name
                if(fieldname=='picture'){
                    randomFileName = randomString();
                    prod.picture[0].filename = randomFileName;
                    //console.log(prod.picture[0].filename);
                }
            }
            //catch when the val is string only
            catch(err) {
                prod[fieldname] = val;
            }
        });
        busboy.on('finish', function() {
        prod.pros[0].dateAdded = new Date();
        prod.cons[0].dateAdded = new Date();
        prod.dateAdded = new Date();
        if (prod.picture) {prod.picture[0].dateAdded = new Date()}
        Products.create(prod, function(err, product) {
            if (err) {
                console.log('Failed to add new product: ' + err);
                return;
            }
        });
        if (!pictureExists){
            //console.log('no picture');
            //var file = fs.createReadStream('./nopicture.jpg');
            fs.createReadStream('./server/nopicture.jpg').pipe(gfs.createWriteStream({
                filename: randomFileName
                //       ,mode: 'w'
                }));
        }
            //console.log('Done parsing form!');
            //res.writeHead(303, { Connection: 'close', Location: '/' });
            res.end();
        });
        req.pipe(busboy);
    },

    //updates product after comments added
    updateProduct : function(req, res, next) {
        var t = req.body;
        if (t){
            res.end();
            return;
        }
        if (t.pros) {
            t.pros.dateAdded = new Date();
            Products.update({_id : t.id},{
                  $push: { pros: t.pros } ,
                  flagNewCommentAdded: true
                  },

                function(err, edited) {
                    if (err){
                        console.log('Error: '+ err);
                        return;
                    }
                    //console.log('Product with _id: '+ t.id + '   UPDATED');
                    res.end();
                });
        }
        if (t.cons) {
            t.cons.dateAdded = new Date();
            Products.update({_id : t.id},{
                $push: { cons: t.cons },
                flagNewCommentAdded: true

            },
                function(err, edited) {
                    if (err){
                        console.log('Error: '+ err);
                        return;
                    }
                    //console.log('Product with _id: '+ t.id + '   UPDATED');
                    res.end();
                });
        }
        res.end();

    }

    //adds product to DB
//    createProduct: function(req, res, next) {
//
//        req.body.pros[0].dateAdded = new Date();
//        req.body.cons[0].dateAdded = new Date();
//        req.body.dateAdded = new Date();
//        if (req.body.picture) {req.body.picture[0].dateAdded = new Date()}
//        //console.log(req.body);
////
////        Products.create(req.body, function(err, product) {
////            if (err) {
////                console.log('Failed to add new product: ' + err);
////                return;
////            }
////            res.end();
////        });
//
//    },
        //TODO hints during searching
//    searchingResult : function(req, res, next){
//
//    }

    };
