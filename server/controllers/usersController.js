var Users = require('mongoose').model('Users')
    ,passport = require('passport') //JS module which adds an user property to each request message
    ,localPassport = require('passport-local')
    ,crypto = require('crypto')//this is an encryption module included in node.js
    ,GoogleStrategy = require('passport-google').Strategy
    ;

passport.use(new localPassport(function (username ,password ,done) {
    Users.findOne({username: username}).exec(function (err, user) {
        if (err){
            console.log('Error loading user: '+ err);
            return;
        }
         //tuk veche se izvikva metoda, koito e dobaven kam Usershema na userite
        if (user && user.authenticate(password)){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}));

//for login through Google
passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:3030/auth/google/return',
        realm: 'http://localhost:3030/'
    },
    function(identifier, profile, done) {
        User.findOrCreate({ openId: identifier }, function(err, user) {
            done(err, user);
        });
    }
));


passport.serializeUser(function (user, done) {
    if (user){
        done(null, user._id);
    }
});

passport.deserializeUser(function (id, done) {
    Users.findOne({_id: id}).exec(function (err, user) {
        if (user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
});

function generateSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function generateHashedPassword(salt,pwd) {
    var hmac = crypto.createHmac('sha1', salt); //zadavame SHA-1 encryption algorithm to be used
    return hmac.update(pwd).digest('hex'); //converts the password by SHA-1 and the salt, then converts the result in hex number
}


module.exports = {
    userAuth: function (req, res, next) {
        var auth = passport.authenticate('local', function (err, user) {
            if (err) return next(err);
            if (!user) res.send({success: false});
            //asks the passport module to log the user in
            req.logIn(user, function (err) {
                if (err) return next(err);
                res.send({success: true, user: {username: user.username}});
            })
        });
        auth(req, res, next);
    },
    userLogout: function (req, res, next) {
        req.logOut(); //asks the passport module to log the user out
        res.send({success: true});

    },
    createUser: function (req, res, next) {
        var newUser = req.body;
        newUser.salt = generateSalt();
        newUser.hashPass = generateHashedPassword(newUser.salt, newUser.password);
        Users.create(newUser, function (err, user) {
            if (err){
                //res.status(400);
                return res.send({success: false, reason: err.toString()})
            }
            req.logIn(user, function (err) {
                if (err){
                    return next(err);
                }
                res.send({success: true, user: {username: user.username}});
            })

        });



    }

};


