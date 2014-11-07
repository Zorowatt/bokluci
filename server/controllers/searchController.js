var Search = require('mongoose').model('SearchBuffer')
    ,Products = require('mongoose').model('Product')
    ;

var cirToLat = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
var latToCyr = {'y':'ъ','Y':'Ъ','c':'ц','C':'Ц','q':'я','Q':'Я','a':'а','b':'б','v':'в','w':'в','g':'г','d':'д','e':'е','j':'ж','z':'з','i':'и','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','r':'р','s':'с','t':'т','u':'у','f':'ф','h':'х','A':'А','B':'Б','V':'В','W':'В','G':'Г','D':'Д','E':'Е','J':'Ж','Z':'З','I':'И','K':'К','L':'Л','M':'М','N':'Н','O':'О','P':'П','R':'Р','S':'С','T':'Т','U':'У','F':'Ф','H':'Х'};
function transliterate(word) {
    var arr = word.split('');
    var newWord=[];
    var origin=[];
    var oringPlusU=[];
    var variants=[];
    for(i= 0;i<arr.length;i++){
        if (arr[i].charCodeAt(0)>1039 && arr[i].charCodeAt(0)<1104){
            //newWord.push(transFromCyrToLat(arr[i]));
        }

        else{

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
    return variants;//newWord.join('');
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

    searchSuggestions: function(req, res, next) {
        req.body.search = escapeRegExp(req.body.search);
//        req.body.search = req.body.search.replace('/', '');
//        req.body.search = req.body.search.replace('\\', '');
        var p = transliterate(req.body.search);

        p[0] = p[0]!='' ? p[0] : 'щщщщщщ';
        p[1] = p[1]!='' ? p[1] : 'щщщщщщ';
        p[2] = p[2]!='' ? p[2] : 'щщщщщщ';
        p[3] = p[3]!='' ? p[3] : 'щщщщщщ';
        console.log(p);
        console.log(req.body.search);

        //str1 =  '/^'+req.query.search+'/';
        //console.log(str1);
        //var re = new RegExp(str1);


        var findOptions = {
            flagIsNew: false,
            $or : [{name: { $regex: req.body.search, $options: "i" }},{name: { $regex: p[0], $options: "i" }},{name: { $regex: p[1], $options: "i" }},{name: { $regex: p[2], $options: "i" }},{name: { $regex: p[3], $options: "i" }} ]
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
