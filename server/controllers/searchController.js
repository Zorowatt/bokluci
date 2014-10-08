var Search = require('mongoose').model('SearchBuffer');

module.exports = {

    searchSuggestions: function(req, res, next) {
        Search.find().exec(function (err, collection) {
                if (err) {
                    console.log('SearchBuffer can not be loaded: ' + err);
                }
            var arr = collection[0].buffer;
            var str = req.query.search;
            //console.log(collection[0].buffer);
            var newArr=[];
            for (var j=0; j<arr.length; j++) {
                if (arr[j].match(str))
                {
                    //TODO do not repeat elements in newArr
                    newArr.push(arr[j])
                };
            }


                res.send(newArr.slice(0,4));
            })
        }
};
