var Users = require('mongoose').model('Users')
    ,passport = require('passport') //JS module which adds an user property to each request message
    ,localPassport = require('passport-local')
    ;


passport.use(new localPassport(function (username ,password ,done) {
    Users.findOne({username: username}).exec(function (err, user) {
        if (err){
            console.log('Error loading user: '+ err);
            return;
        }
        //tuk veche se izvikva metoda, koito e dobaven kam Usershema na userite
        if (user && user.confirmedEmail && user.authenticate(password)){
            user.passRecovered = true;
            user.save();
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}));
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


module.exports = {
    userLogin: function (req, res, next) {
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

    isAuthenticated: function(req, res, next){
        if (!req.isAuthenticated()) {
            res.redirect('/');
            res.end();
        }
        else {
            next();
        }
    }
};