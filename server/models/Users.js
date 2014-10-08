var mongoose = require('mongoose')
    //uncomment below only for initial adding of users in mongodb
//    ,crypto = require('crypto') //this is an encryption module included in node.js
    ;

var userSchema = mongoose.Schema ({
    username: String,
    firstName: String,
    lastName: String,
    salt: String,
    hashPass: String,
    roles: [String]
});
    //proveriava dali podadenata parola otgovaria na parolat zapisana v bazata
userSchema.method({
    authenticate: function (password) {
        if (generateHashedPassword(this.salt, password) === this.hashPass){
            return true;
        }
        else{
            return false;
        }
    }
});

var user = mongoose.model('Users',userSchema);

//---------------------------check is there any user exists. If not add some users

//
//module.exports.seedInitialUsers = function() {
//    user.find({}).exec(function (err, collection) {
//        if (err) {
//            console.log('Cannot find users: ' + err);
//            return;
//        }
//
//        //        // if you want to clear the DB and push same data to it just remove the "//", each
//        //     //user.remove(function(){
//        //
//        if (collection.length === 0) {
//            var salt;
//            var hashedPwd;
//            salt = generateSalt(); //generate some random string(so called SALT)
//            hashedPwd = generateHashedPassword(salt, 'zlatozar'); //encrypts the password(zlatozar)
//            user.create({username: 'zorowatt', firstName: 'Zlatozar', lastName: 'Dichev', salt: salt, hashPass: hashedPwd, roles: ['admin']});
//            salt = generateSalt();
//            hashedPwd = generateHashedPassword(salt, 'eva');
//            user.create({username: 'evichka', firstName: 'Eva', lastName: 'Dobreva', salt: salt, hashPass: hashedPwd, roles: ['user']});
//            salt = generateSalt();
//            hashedPwd = generateHashedPassword(salt, 'petia');
//            user.create({username: 'maika', firstName: 'Patia', lastName: 'Petkova', salt: salt, hashPass: hashedPwd});
//            console.log('New users added to DB ... ');
//        }
//    });
//};
//function generateSalt() {
//    return crypto.randomBytes(128).toString('base64');
//}
//
//function generateHashedPassword(salt,pwd) {
//    var hmac = crypto.createHmac('sha1', salt); //zadavame SHA-1 encryption algorithm to be used
//    return hmac.update(pwd).digest('hex'); //converts the password by SHA-1 and the salt, then converts the result in hex number
//}
