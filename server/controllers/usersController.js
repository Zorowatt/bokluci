var Users = require('mongoose').model('Users')
    ,passport = require('passport') //JS module which adds an user property to each request message
    ,localPassport = require('passport-local')
    ,crypto = require('crypto')//this is an encryption module included in node.js
    ,GoogleStrategy = require('passport-google').Strategy
    ,nodemailer = require("nodemailer")
    ,smtpTransport = require('nodemailer-smtp-transport');
    ;



passport.use(new localPassport(function (username ,password ,done) {
    Users.findOne({username: username}).exec(function (err, user) {
        if (err){
            console.log('Error loading user: '+ err);
            return;
        }
         //tuk veche se izvikva metoda, koito e dobaven kam Usershema na userite
        if (user && user.confirmedEmail && user.authenticate(password)){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    })
}));

//for login through Google
//passport.use(new GoogleStrategy({
//        returnURL: 'http://localhost:3030/auth/google/return',
//        realm: 'http://localhost:3030/'
//    },
//    function(identifier, profile, done) {
//        User.findOrCreate({ openId: identifier }, function(err, user) {
//            done(err, user);
//        });
//    }
//));


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
function randomString(numbers) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = numbers;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
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

        newUser.confirmedEmail = false; //this is to verify user after it's confirmation e-mail
        newUser.randomIdForEmailConfirmation = randomString(40); //Creates random token for user confirmation during E-mail exchange
        var t = new Date();

        newUser.expirationConfirmationTime = t.setHours(t.getHours()+24); //sets expiration Date and time



        newUser.host = req.get('host');



  // TODO if invalid e-mail has being sent

        Users.create(newUser, function (err, user) {
            if (err){
                //res.status(400);
                return res.send({success: false, reason: err.toString()})
            }


            var link = "http://"+req.get('host')+"/verify?id="+newUser.randomIdForEmailConfirmation;

            //console.log(req.get('host'));
            var transporter = nodemailer.createTransport(smtpTransport({
                service: "Gmail",
                auth: {
                    user: "deffered1234@gmail.com",
                    pass: "deffered4321"
                },
                //this is to jump over AVAST
                tls: {
                    rejectUnauthorized: false
                }
            }));
            var mailOptions={
                to: newUser.email,
                subject : 'Please confirm your Email account!',
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a><br> The confirmation should be done within 24 hours!"
            }

            transporter.sendMail(mailOptions, function(err, response){
                if(err){
                    console.log(err);
                    return res.send({success: false, reason: err.toString()})
                }else{
                    //console.log("Message sent: " + response.message);
                    res.send({success: true, reason: 'Confirmation Message has been sent to your E-mail!'});
                    //res.end("sent");
                }
            })
//            req.logIn(user, function (err) {
//                if (err){
//                    return next(err);
//                }
//                res.send({success: true, user: {username: user.username}});
//            })

        });



    },



    verifyUser: function (req, res, next) {
        //console.log(req.protocol+"://"+req.get('host'));

        //console.log(req.query.id);


        Users.findOne({randomIdForEmailConfirmation: req.query.id}).exec(function (err, user) {
            if (err){
                console.log('No such user exists! ');
                res.end("<h1>No such user exists!");

            }
            if (user) {
                if ((req.protocol + "://" + req.get('host')) == ("http://" + user.host)) {
                    console.log("Domain is matched. Information is from Authentic email");


                    //confirm date for confiration
                    var t = new Date();
                    if (t > user.expirationConfirmationTime) {

                        Users.remove({_id: user._id},
                            function (err, success) {
                                if (err) {
                                    console.log('Error after user removing: ' + err);
                                }
                            });

                        res.end("<h1>Confirmation is too late.<br> You have to create new account!");
                        return;
                    }

                    Users.update({_id: user._id}, {
                            confirmedEmail: true
                        },
                        function (err, success) {
                            if (err) {
                                console.log('Error after user confirmation e-mail: ' + err);
                                res.end("<h1>Error after user confirmation e-mail: ");
                            }
                        });
                }
                else {
                    res.end("<h1>Request is from unknown source");
                    return;
                }
            }
            else{
                res.end("<h1>No such user or confirmation is too late!");
                return;
            }
            //            req.logIn(user, function (err) {
//                if (err){
//                    return next(err);
//                }
//                res.send({success: true, user: {username: user.username}});
//            })
//TODO login after email confirmation success
                res.redirect('/');
                //res.end("<h1>Email is been Successfully verified");

            })




    }

};


