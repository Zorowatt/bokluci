var mongoose = require('mongoose')
    ,crypto = require('crypto') //this is an encryption module included in node.js
    ;

var userSchema = mongoose.Schema ({
    username: { type: String, require: '{PATH} is required', unique: true },
    email: { type: String, require: '{PATH} is required', unique: true },
    firstName: { type: String, require: '{PATH} is required' },
    lastName: String,
    salt: String,
    hashPass: String,
    roles: [String],
    host: String,
    confirmedEmail: Boolean,
    randomIdForEmailConfirmation: {type: String, unique: true},
    expirationConfirmationTime: Date,
    passRecovered: Boolean,

    //TODO get the user IP address after sign up
    userIP: String
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


//module.exports.seedInitialUsers = function() {
//    user.remove(function() {
//        var salt;
//        var hashedPwd;
//        salt = generateSalt(); //generate some random string(so called SALT)
//        hashedPwd = generateHashedPassword(salt, 'zlatozar'); //encrypts the password(zlatozar)
//        user.create({username: 'zorowatt', firstName: 'Zlatozar', lastName: 'Dichev', salt: salt, hashPass: hashedPwd, roles: ['admin']});
//        salt = generateSalt();
//        hashedPwd = generateHashedPassword(salt, 'eva');
//        user.create({username: 'evichka', firstName: 'Eva', lastName: 'Dobreva', salt: salt, hashPass: hashedPwd, roles: ['user']});
//        salt = generateSalt();
//        hashedPwd = generateHashedPassword(salt, 'petia');
//        user.create({username: 'maika', firstName: 'Patia', lastName: 'Petkova', salt: salt, hashPass: hashedPwd});
//        console.log('New users added to DB ... ');
//        salt = generateSalt();
//        hashedPwd = generateHashedPassword(salt, 'zzz');
//        user.create({username: 'zzz', firstName: 'zzz', lastName: 'ddd', salt: salt, hashPass: hashedPwd});
//        console.log('New users added to DB ... ');
//    });
//};

//function generateSalt() {
//    return crypto.randomBytes(128).toString('base64');
//}

function generateHashedPassword(salt,pwd) {
    var hmac = crypto.createHmac('sha1', salt); //zadavame SHA-1 encryption algorithm to be used
    return hmac.update(pwd).digest('hex'); //converts the password by SHA-1 and the salt, then converts the result in hex number
}
