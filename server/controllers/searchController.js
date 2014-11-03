var Search = require('mongoose').model('SearchBuffer')
    ,Products = require('mongoose').model('Product')
    ;

module.exports = {

    searchSuggestions: function(req, res, next) {

        //str1 =  '/^'+req.query.search+'/';
        //console.log(str1);
        //var re = new RegExp(str1);


        var findOptions = {
            flagIsNew: false,
            name: { $regex: req.body.search, $options: "i" }
        };

        Products.find(findOptions).sort({ pros: -1 }).exec(function (err, collection) {
            if (err) {
                console.log('Products can not be loaded: ' + err);
            }
            if (collection!==undefined && collection.length > 0){
                var arr = [];
                for (i = 0; i < collection.length; i++) {
                    arr.push(collection[i].name);
                    if (i==3){break;}
                }
               // console.log(collection);


                    res.send(arr);
                }
            res.end();

        });




//        Search.find().exec(function (err, collection) {
//                if (err) {
//                    console.log('SearchBuffer can not be loaded: ' + err);
//                }
//            var arr = collection[0].buffer;
//            var str = req.query.search;
//            //console.log(collection[0].buffer);
//            var newArr=[];
//            for (var j=0; j<arr.length; j++) {
//                if (arr[j].match(str))
//                {
//                    //TODO do not repeat elements in newArr
//                    newArr.push(arr[j])
//                };
//            }
//
//
//                res.send(newArr.slice(0,4));
//            })
        }
};
