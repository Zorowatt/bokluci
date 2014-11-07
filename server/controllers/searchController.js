var Search = require('mongoose').model('SearchBuffer')
    ,Products = require('mongoose').model('Product')
    ;

var cirToLat = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
var latToCyr = {'a':'а','b':'б','v':'в','w':'в','g':'г','d':'д','e':'е','j':'ж','z':'з','i':'и','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','r':'р','s':'с','t':'т','u':'у','f':'ф','h':'х','A':'А','B':'Б','V':'В','W':'В','G':'Г','D':'Д','E':'Е','J':'Ж','Z':'З','I':'И','K':'К','L':'Л','M':'М','N':'Н','O':'О','P':'П','R':'Р','S':'С','T':'Т','U':'У','F':'Ф','H':'Х'};
function transliterate(word) {
    var arr = word.split('');
    var newWord=[];
    for(i= 0;i<arr.length;i++){
        if (arr[i].charCodeAt(0)>1039 && arr[i].charCodeAt(0)<1104){
            newWord.push(transFromCyrToLat(arr[i]));
        }
        else{
            newWord.push(transFromLatToCyr(arr[i]));
        }
    }
    return newWord.join('');
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


module.exports = {

    searchSuggestions: function(req, res, next) {

        var p = transliterate(req.body.search);
        //console.log(p);


        //str1 =  '/^'+req.query.search+'/';
        //console.log(str1);
        //var re = new RegExp(str1);


        var findOptions = {
            flagIsNew: false,
            $or : [{name: { $regex: req.body.search, $options: "i" }},{name: { $regex: p, $options: "i" }} ]
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
