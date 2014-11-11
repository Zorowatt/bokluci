var Products = require('mongoose').model('Product')
    ,Images = require('mongoose').model('Images')
    ,mongoose = require('mongoose')
    //,Grid = require('gridfs-stream')
    ,db = mongoose.connection
    //,gfs = Grid(db.db, mongoose.mongo)
    ,Busboy = require('busboy')
    ,fs = require('fs')
    //,lwip = require('lwip')
    //,stream = require('stream')
    ,stream = require('streamifier')
    //,easyimg = require('easyimage')
    ,gm = require('gm').subClass({ imageMagick: true })
    ;


//creates random string for the image name
function randomString() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 20;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}
var cirToLat = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
var latToCyr = {'y':'ъ','Y':'Ъ','c':'ц','C':'Ц','q':'я','Q':'Я','a':'а','b':'б','v':'в','w':'в','g':'г','d':'д','e':'е','j':'ж','z':'з','i':'и','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','r':'р','s':'с','t':'т','u':'у','f':'ф','h':'х','A':'А','B':'Б','V':'В','W':'В','G':'Г','D':'Д','E':'Е','J':'Ж','Z':'З','I':'И','K':'К','L':'Л','M':'М','N':'Н','O':'О','P':'П','R':'Р','S':'С','T':'Т','U':'У','F':'Ф','H':'Х'};
function transliterate(word) {
    var arr = word.split('');
    var newWord=[];
    var origin=[];
    var english=[];
    var variants=[];
    for(i= 0;i<arr.length;i++){
        if(arr[i].charCodeAt(0)>1039 && arr[i].charCodeAt(0)<1104){
            english.push(transFromCyrToLat(arr[i]));
        }
        if (arr[i].charCodeAt(0)>64 && arr[i].charCodeAt(0)<91 || arr[i].charCodeAt(0)>96 && arr[i].charCodeAt(0)<123) {
            //slavei,haimana,slavej
            if (arr[i]=='e') {
                if (arr[i + 1] == 'j') {
                    origin.push('еж');
                    newWord.push('ей');
                    i++;
                    continue;
                }
            }
            if (arr[i]=='e') {
                if (arr[i + 1] == 'i') {
                    origin.push('еи');
                    newWord.push('ей');
                    i++;
                    continue;
                }
            }
            //naj-,nai-
            if (arr[i]=='a') {
                if (arr[i + 1] == 'j') {
                    origin.push('аж');
                    newWord.push('ай');
                    i++;
                    continue;
                }
            }
            if (arr[i]=='a') {
                if (arr[i + 1] == 'i') {
                    origin.push('аи');
                    newWord.push('ай');
                    i++;
                    continue;
                }
            }
            //iuli,juli
            if (arr[i]=='i') {
                if (arr[i + 1] == 'u') {
                    origin.push('иу');
                    newWord.push('ю');
                    i++;
                    continue;
                }
            }
            if (arr[i]=='j') {
                if (arr[i + 1] == 'u') {
                    origin.push('жу');
                    newWord.push('ю');
                    i++;
                    continue;
                }
            }



            //jordan,iordan,djordani
            if (arr[i]=='i') {
                if (arr[i + 1] == 'o') {
                    origin.push('ио');
                    newWord.push('йо');
                    i++;
                    continue;
                }
            }
            if (arr[i]=='j') {
                if (arr[i + 1] == 'o') {
                    origin.push('жо');
                    newWord.push('йо');
                    i++;
                    continue;
                }
            }


            //moi,twoi
            if (arr[i]=='o') {
                if (arr[i + 1] == 'i') {
                    origin.push('ои');
                    newWord.push('ой');
                    i++;
                    continue;
                }
            }
            //cska,carevec,tsarevets,tcarevetc
            if (arr[i]=='t') {
                if (arr[i + 1] == 's') {
                    origin.push('тс');
                    newWord.push('ц');
                    i++;
                    continue;
                }
                if (arr[i + 1] == 'c') {
                    origin.push('тц');
                    newWord.push('ц');
                    i++;
                    continue;
                }
            }
            //TODO chehia
            //chapla
            if (arr[i]=='c') {
                if (arr[i + 1] == 'h') {
                    origin.push('цх');
                    newWord.push('ч');
                    i++;
                    continue;
                }
            }
            //niama,njama
            if (arr[i]=='i') {
                if (arr[i + 1] == 'a') {
                    origin.push('иа');
                    newWord.push('я');
                    i++;
                    continue;
                }
            }
            if (arr[i]=='j') {
                if (arr[i + 1] == 'a') {
                    origin.push('жа');
                    newWord.push('я');
                    i++;
                    continue;
                }
            }

            //shtipka,stipka,sharka
            if (arr[i]=='s') {
                if (arr[i + 1] == 'h') {
                    if(arr[i+2] == 't'){
                        origin.push('схт');
                        newWord.push('щ');
                        i++;
                        i++;
                        continue;
                    }else{
                        origin.push('сх');
                        newWord.push('ш');
                        i++;
                        continue;
                    }
                }
                if (arr[i + 1] == 't'){
                    origin.push('ст');
                    newWord.push('щ');
                    i++;
                    continue;
                }
            }

            origin.push(transFromLatToCyr(arr[i]));
            newWord.push(transFromLatToCyr(arr[i]));

        }
    }

    //TODO ninja
    //TODO chehia

    variants.push(newWord.join(''));
    variants.push(origin.join(''));
    variants.push(newWord.join('').replace(/у/g, 'ъ'));
    variants.push(origin.join('').replace(/у/g, 'ъ'));
    variants.push(english.join(''));
    return variants;
}
function transFromCyrToLat(letler) {
    return letler.split('').map(function (char) {
        return cirToLat[char] || char;
    });
}
function transFromLatToCyr(letler) {
    return letler.split('').map(function (char) {
        return latToCyr[char] || char;
    });
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "щщ");
}
module.exports = {
    convertImage: function (req, res, next) {
               //console.time("dbsave");
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var fileExt = filename.split('.').pop();
            var thumbnailFileName = randomString();
            var fileName = randomString();


            var picc = {
                name: thumbnailFileName,
                ready: false,
                contentType: 'image/'+fileExt
            };
            Images.create(picc, function(err, imagesDb) {
                if (err) {
                    return console.log('Failed to add new product: ' + err);
                }
                gm(file,filename)
                    .noProfile()
                    .thumbnail(150, 150)
                    .toBuffer(fileExt,function (err, buffer) {
                        if (err)  {
                            //console.log(err);
                            return res.end();
                        }

                        var t = stream.createReadStream("data:image/"+fileExt+";base64,"+buffer.toString('base64')+thumbnailFileName+fileName);
                        t.pipe(res);
                    });
                gm(file,filename)
                    .noProfile()
                    .resize(150, 150)
                    .toBuffer(fileExt,function (err, buffer) {
                        if (!err)  {
                            Images.update({_id:imagesDb._id},{dataThumb: buffer}, function(err, product) {
                                //console.log(product);
                                if (err) {
                                    console.log('Failed to add new product: ' + err);
                                }
                            })
                        }
                    });
                gm(file,filename)
                    .noProfile()
                    .resize(500, 500)
                    .toBuffer(fileExt,function (err, bufferr) {
                        if (!err)  {
                            Images.update({_id:imagesDb._id},{dataFile: bufferr}, function(err, product) {
                                //console.log(product);
                                if (err) {
                                    console.log('Failed to add new product: ' + err);
                                }
                            })
                        }
                    });
                });
        });
        req.pipe(busboy);
    },
    createProduct: function(req, res, next) {



       // var pictureExists = false;
        var busboy = new Busboy({ headers: req.headers });
        var prod = {};
//        var randomFileName = randomString();
//        var thumbnailFileName = randomString();


//        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//            pictureExists = true;
//            var fileExt = filename.split('.').pop();
//            gm(file,filename)
//                .noProfile()
//                .thumbnail(150, 150)
//                .stream(function (err, stdout, stderr) {
//                    if(err){
//                        return pictureExists = false;
//
//                    }
//                    stdout.pipe(gfs.createWriteStream({
//                        filename: thumbnailFileName
//                        //       ,mode: 'w'
//                    }));
//                });
//            gm(file,filename)
//                .noProfile()
//                .resize(500, 500)
//                .stream(function (err, stdout, stderr) {
//                    if(err){
//                        return pictureExists = false;
//
//                    }
//                    stdout.pipe(gfs.createWriteStream({
//                        filename: randomFileName
//                        //       ,mode: 'w'
//                    }));
//                });
//
//
//
//
////            if (fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'png') {
////                pictureExists = false;
////                return;
////            }
////            var bufs = [];
////            file.on('data', function (d) {
////                bufs.push(d);
////                //console.log(d.length);
////            });
////            file.on('end', function () {
////                var buf = Buffer.concat(bufs);
////                lwip.open(buf, fileExt, function (err, originImage) {
////                    if (err) {
////                        console.log(err);
////                        pictureExists = false;
////                        return;
////                    }
////                    var w = originImage.width(),
////                        h = originImage.height(),
////                        modelW = 500,
////                        modelH = 500,
////                        thumbW = 100,
////                        thumbH = 100;
////
////                    lwip.create(modelW, modelH, 'white', function (err, background) {
////                        if (err) {
////                            console.log(err);
////                            pictureExists = false;
////                            return;
////                        }
////                        if (h == w) {
////                            h = modelH;
////                            w = modelW;
////                        } else {
////                            if (w > h) {
////                                if (w > modelW) {
////                                    h = Math.floor(modelH * h / w);
////                                    w = modelW;
////                                } else {
////                                    h = h * modelW / w;
////                                    w = modelW;
////                                }
////                            }
////                            else {
////                                if (h > modelH) {
////                                    w = Math.floor(modelW * w / h);
////                                    h = modelH;
////                                } else {
////                                    w = w * modelH / h;
////                                    h = modelH;
////                                }
////                            }
////                        }
////                        originImage.resize(w, h, function (err, resizedImage) {
////                            if (err) {
////                                console.log(err);
////                                pictureExists = false;
////                                return;
////                            }
////                            var left = 0
////                                , top = 0
////                                ;
////                            //centers the image into the background
////                            if (w < modelW) {
////                                left = Math.floor((modelW - w) / 2);
////                            }
////                            if (h < modelH) {
////                                top = Math.floor((modelH - h) / 2);
////                            }
////
////                            background.paste(left, top, resizedImage, function (err, readyImage) {
////                                if (err) {
////                                    console.log(err);
////                                    pictureExists = false;
////                                    return;
////                                }
////                                readyImage.toBuffer('jpg', {quality: 100}, function (err, bufferedImage) {
////                                    if (err) {
////                                        console.log(err);
////                                        pictureExists = false;
////                                        return;
////                                    }
////                                    //creates readable stream from buffered image and pipes it to GridFs
////                                    stream.createReadStream(bufferedImage).pipe(gfs.createWriteStream({
////                                        filename: randomFileName
////                                        //       ,mode: 'w'
////                                    }));
////                                    //creates the thumbnail of the converted image
////                                    readyImage.resize(thumbW, thumbH, function (err, thumbImage) {
////                                        if (err) {
////                                            console.log(err);
////                                            pictureExists = false;
////                                            return;
////                                        }
////                                        thumbImage.toBuffer('jpg', {quality: 100}, function (err, bufferedThumbImage) {
////                                            if (err) {
////                                                console.log(err);
////                                                pictureExists = false;
////                                                return;
////                                            }
////                                            //creates readable stream from buffered image and pipes it to GridFs
////                                            stream.createReadStream(bufferedThumbImage).pipe(gfs.createWriteStream({
////                                                filename: thumbnailFileName
////                                                //       ,mode: 'w'
////                                            }));
////                                        })
////                                    });
////                                })
////                            })
////                        })
////                    });
////                });
////            })
//        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
            //console.log('Field [' + fieldname + ']: value: ' + inspect(val));

            //this is to converts val/data from strings to real values(arrays, objects, ets.)
            try {
                prod[fieldname] = JSON.parse(val);
                //randomly generate picture name
//                if(fieldname=='picture'){
//                    prod.picture[0].filename = randomFileName;
//                    prod.thumbnail = thumbnailFileName;
//                }
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
            prod.visited = 0;
            //if (prod.picture) {prod.picture[0].dateAdded = new Date()}
            Images.findOneAndUpdate({name:prod.thumbnail},{ready: true}, function (err, imageDb) {

                Products.create(prod, function(err, product) {
                    if (err) {
                        console.log('Failed to add new product: ' + err);
                    }
                });
            }),
            //TODO before add to DB check if object contains any commands against mongodb. PREVENTING FROM INJECTION ATTACK


//            if (!pictureExists){
//                fs.createReadStream('./server/nopicture.jpg').pipe(gfs.createWriteStream({
//                    filename: randomFileName
//                    //       ,mode: 'w'
//                }));
//                fs.createReadStream('./server/nopictureThumb.jpg').pipe(gfs.createWriteStream({
//                    filename: thumbnailFileName
//                    //       ,mode: 'w'
//                }))
//            }
            //console.log('Done parsing form!');
            //res.writeHead(303, { Connection: 'close', Location: '/' });
            res.end();
        });
        req.pipe(busboy);
    },


    next : function (req, res) {
//        if (req.cookies.home!==undefined){
//            l = parseInt(req.cookies.home.l);
//            s = parseInt(req.cookies.home.s);
//
//            search = req.cookies.home.search;
//            res.clearCookie('home');
//            res.cookie('home',{l:6,s:s+6,search:''},{maxAge: 100000});
//            console.log(l+'--'+s+'--'+search);
//        }
        res.end();
    },
    prev : function (req, res) {
//        if (req.cookies.home!==undefined){
//            l = parseInt(req.cookies.home.l);
//            s = parseInt(req.cookies.home.s);
//            search = req.cookies.home.search;
//            res.clearCookie('home');
//            res.cookie('home',{l:6,s:s-6,search:''},{maxAge: 100000});
//        }
        res.end();
    },

    getAllProducts: function(req, res, next) {

        //remove not allowed symbols
        req.query.search = escapeRegExp(req.query.search);

        //replace latin letter with cyrillic
        var p = transliterate(req.query.search);
        p[0] = p[0]!='' ? p[0] : 'щщщщщщ';
        p[1] = p[1]!='' ? p[1] : 'щщщщщщ';
        p[2] = p[2]!='' ? p[2] : 'щщщщщщ';
        p[3] = p[3]!='' ? p[3] : 'щщщщщщ';
        p[4] = p[4]!='' ? p[4] : 'щщщщщщ';
        //console.log(p);
        var limit = req.query.l;
        var skip = req.query.s;

        //Validate skip and limit
        if (skip < 0) {skip = 0}
        if (limit <1) {limit = 1}
        if (limit > 20) {limit = 20}

        if (req.query.l && req.query.s) {
            //if (req.query.search.length == 0) {
                var findOptions = {
                    flagIsNew: false,
                    //name: { $regex: req.query.search, $options: "i" }
                    $or : [
                        {name: { $regex: req.query.search, $options: "i" }},
                        {name: { $regex: p[0], $options: "i" }},
                        {name: { $regex: p[1], $options: "i" }},
                        {name: { $regex: p[2], $options: "i" }},
                        {name: { $regex: p[3], $options: "i" }},
                        {name: { $regex: p[4], $options: "i" }}
                    ]
                };
                Products.find(findOptions).sort({ prosCount: -1 }).limit(limit).skip(skip)
                    .exec(function (err, collection) {
                    if (err) {
                        console.log('Products can not be loaded: ' + err);
                    }
                    if(collection!==undefined && collection.length>0) {
                        var arr = [];
                        for (i = 0; i < collection.length; i++) {
                            var p={};
                            p._id = collection[i]._id;
                            p.name = collection[i].name;
                            p.pros = collection[i].pros;
                            p.cons = collection[i].cons;
                            p.visited = collection[i].visited;
                            p.thumbnail = collection[i].thumbnail;
                            p.dateAdded = collection[i].dateAdded;
                            arr.push(p);
                            }
//                        res.clearCookie('home');
//                        res.cookie('home',{l:l,s:s,search: search},{maxAge: 100000});

                        res.send(arr);
                    }
                        else{
                        res.end();
                    }
                })
            //}
//            else {
//                var findOptions = {
//                    flagIsNew: false,
//                    name: { $regex: req.query.search, $options: "i" }
//                };
//                Products.find(findOptions).sort({ prosCount: -1}).limit(req.query.l).skip(req.query.s).exec(function (err, collection) {
//                    if (err) {
//                        console.log('Products can not be loaded: ' + err);
//                    }
//                    if(collection!==undefined && collection.length>0) {
//                        var arr = [];
//                        for (i = 0; i < collection.length; i++) {
//                            var p={};
//                            p._id = collection[i]._id;
//                            p.name = collection[i].name;
//                            p.pros = collection[i].pros;
//                            p.cons = collection[i].cons;
//                            //p.picture = collection[i].picture;
//                            p.thumbnail = collection[i].thumbnail;
//                            p.dateAdded = collection[i].dateAdded;
//                            arr.push(p);
//                        }
//                    res.send(arr);
//                    }
//
//                })
//            }
        }
        else{
            res.redirect('/');
        }
    },
    getImage: function(req, res, next) {
        if (req.params.id == 'na' || req.params.id === undefined) {
            fs.createReadStream('./server/nopicture.jpg').pipe(res);
            return;
        }

        //console.log('asd');
        Images.findOne({name: req.params.id})
            .exec(function (err, document) {
                //console.log(document);
                var t = stream.createReadStream(document.dataFile);
                res.setHeader('Expires', new Date(Date.now() + 604800000));
                res.setHeader('Content-Type', document.contentType);
                //var t = stream.createReadStream("data:image/"+fileExt+";base64,"+buffer.toString('base64')+thumbnailFileName+fileName);
//                    t.pipe(gfs.createWriteStream({
//                        filename: thumbnailFileName
//                        //       ,mode: 'w'
//                    }));
                t.pipe(res);
            });
    },
    getThumb: function(req, res, next) {
        if (req.params.id=='na' || req.params.id===undefined){
            fs.createReadStream('./server/nopictureThumb.jpg').pipe(res);
            return;
        }

        //console.log('asd');
        Images.findOne({name: req.params.id})
            .exec(function(err, document) {
                //console.log(document);
                var t = stream.createReadStream(document.dataThumb);
                res.setHeader('Expires', new Date(Date.now() + 604800000));
                res.setHeader('Content-Type', document.contentType);
                //var t = stream.createReadStream("data:image/"+fileExt+";base64,"+buffer.toString('base64')+thumbnailFileName+fileName);
//                    t.pipe(gfs.createWriteStream({
//                        filename: thumbnailFileName
//                        //       ,mode: 'w'
//                    }));
                t.pipe(res);
            });
    },
    getProductById: function(req, res, next){
        //console.log(req.session.name);
        req.session.name = req.session.name || 56;


        if (req.cookies.v === undefined){
            res.cookie('v',randomString(),{maxAge: 86400000});
            var count = 1;
        }else{
            var count = 0;
        }
        Products.findOneAndUpdate({ _id : req.params.id },{ $inc: { visited: count }}).exec(function(err, document) {
            if (err) {
                res.send({missing:true});
            }
            var p ={};
           // p._id = document._id;
            p.name = document.name;
            p.pros = document.pros;
            p.cons = document.cons;
            //p.visited = document.visited;
            p.thumbnail = document.thumbnail;
            p.dateAdded = document.dateAdded;
            res.send(p);
        });

    },

    //updates product after comments added
    updateProduct : function(req, res, next) {
        var t = req.body;
        if (!t){
            res.end();
            return;
        }
        if (!!t.pros) {
            t.pros.dateAdded = new Date();
            t.pros.flagIsNew = true;
            Products.update({_id : t.id},{
                  $push: { pros: t.pros } ,
                  flagNewCommentAdded: true
                  },

                function(err, edited) {
                    if (err){
                        console.log('Error: '+ err);
                        return res.send({success: false});
                    }
                    //console.log('Product with _id: '+ t.id + '   UPDATED');

                });
            return res.send({success: true});
        }
        if (!!t.cons) {
            t.cons.dateAdded = new Date();
            t.cons.flagIsNew = true;
            Products.update({_id : t.id},{
                $push: { cons: t.cons },
                flagNewCommentAdded: true

            },
                function(err, edited) {
                    if (err){
                        console.log('Error: '+ err);
                        res.send({success: false});
                    }
                    //console.log('Product with _id: '+ t.id + '   UPDATED');

                });
            return res.send({success: true});
        }
        res.send({success: false});

    }


};
