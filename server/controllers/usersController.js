var Users = require('mongoose').model('Users')
    ,passport = require('passport') //JS module which adds an user property to each request message
    ,localPassport = require('passport-local')
    ,crypto = require('crypto')//this is an encryption module included in node.js
    ,GoogleStrategy = require('passport-google').Strategy
    ,nodemailer = require("nodemailer")
    ,smtpTransport = require('nodemailer-smtp-transport');
    ;
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
//        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//        console.log(req.headers['x-forwarded-for']);
//        console.log(req.connection.remoteAddress);
//        console.log(req.ip);


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

        //validates pass
        if (newUser.password != newUser.password.replace(/[^a-zA-Z0-9_<>?]/g, "")){
            res.send({success: false, reason: 'Password contains forbidden symbols!'});
            res.end();
            return;
        }
        if (newUser.password.length>16){
            res.send({success: false, reason: 'Password is too long!'});
            res.end();
            return;
        }


        //Check for unique username
        Users.findOne({username: newUser.username}).exec(function (err, user) {
            if (user){
                res.send({success: false, reason: 'This username exists already!'});
                return;
            }
            //Check for unique e-mail
            Users.findOne({email: newUser.email}).exec(function (err, user) {
                if (user){
                    res.send({success: false, reason: 'User with this email address exists already!'});
                    return;
                }

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
                    res.send({success: true, reason: 'Confirmation Message has been sent to your E-mail!'});
                    var link = "http://"+req.get('host')+"/verify?id="+newUser.randomIdForEmailConfirmation;

                    var mailOptions={
                        from: 'Bokluci.bg <deffered1234@gmail.com>',
                        to: newUser.email,
                        subject : 'Please confirm your Email account!',
                        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a><br> The confirmation should be done within 24 hours!"
                    };
                    transporter.sendMail(mailOptions, function(err, response){
                        if(err){
                            res.end('<h1>Email error: '+err)
                        }
                    });
                    res.end();
                });
            });
        });
    },

    verifyUser: function (req, res, next) {

        //checks if id is valid
        if(!req.query.id){
            res.end('<h1>Not authorized access!');
            return;
        }
        if(req.query.id !== req.query.id.replace(/[^a-zA-Z0-9]/g, "") || req.query.id.length != 40){
            res.end('<h1>Do not try this at home!');
            return;
        }


        Users.findOne({randomIdForEmailConfirmation: req.query.id}).exec(function (err, user) {
            if (err){
                res.end("<h1>Error! Try again later");
                return;
            }
            if (user) {
                if ((req.protocol + "://" + req.get('host')) == ("http://" + user.host)) {
                    //console.log("Domain is matched. Information is from Authentic email");

                    //if user is already confirmed. Redirect to home page
                    if(user.confirmedEmail){
                        res.redirect('/');
                        return;
                    }

                    //If user is not yet confirmed
                    //Check the expiration date
                    var t = new Date();
                    if (t > user.expirationConfirmationTime) {
                        //If date expired remove user and send message for new sign up
                        Users.remove({_id: user._id},
                            function (err, success) {
                                if (err) {
                                    console.log('Error after user removing: ' + err);
                                }
                            });

                        res.end("<h1>Confirmation is too late.<br> You have to create new account!");
                        return;
                    }

                    //If user confirmation is OK update the user
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

                //if confirmation comes not from the genuine user's e-mail
                else {
                    res.end("<h1>Request is from unknown source");
                    return;
                }
            }
            //if user does not exist it DB
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
    //TODO login after email confirmation success. Maybe!!!

            res.render('verified');
               // res.redirect('/');
                //res.end("<h1>Email is been Successfully verified");
            })
    },
    forgotUser: function (req, res, next) {
        var use = req.body;
        var t = new Date();
        var newToken = randomString(40);
        if (use) {
            Users.findOneAndUpdate({username: use.username },{
                randomIdForEmailConfirmation: newToken,
                expirationConfirmationTime: t.setHours(t.getHours()+24),
                passRecovered: false
            }).exec(function (err, user) {
                    if (err) {
                        res.end("<h1>DB error");
                        return;
                    }

                    if (user) {
                        res.send({success: true, reason: 'Recovery Message has been sent to your E-mail!'});
                        var link = "http://"+user.host+"/recover?id="+newToken;
                        var mailOptions={
                            from: 'Bokluci.bg <deffered1234@gmail.com>',
                            to: user.email,
                            subject : 'Password recovery!',
                            html : "Hello,<br>Your username is:     "+user.username+"<br> Please Click on the link to recover your password.<br><a href="+link+">Recovery link</a>"
                        };
                        transporter.sendMail(mailOptions, function(err, response){
                            if(err){
                                res.end('<h1>Email error: '+err);
                            }
                        });
                        res.end();
                    }
                    else {
                        Users.findOneAndUpdate({email:  use.username},{
                            randomIdForEmailConfirmation: newToken,
                            expirationConfirmationTime: t.setHours(t.getHours()+24),
                            passRecovered: false
                        }).exec(function (err, userr) {
                            if (err) {
                                res.end("<h1>DB error");
                                return;
                            }
                            if (userr) {
                                res.send({success: true, reason: 'Recovery Message has been sent to your E-mail!'});
                                var link = "http://"+userr.host+"/recover?id="+newToken;
                                var mailOptions={
                                    from: 'Bokluci.bg <deffered1234@gmail.com>',
                                    to: userr.email,
                                    subject : 'Password recovery!',
                                    html : "Hello,<br>Your username is:     "+userr.username+"<br> Please Click on the link to recover your password.<br><a href="+link+">Recovery link</a>"
                                };
                                transporter.sendMail(mailOptions, function(err, response){
                                    if(err){
                                        res.end('<h1>Email error: '+err);
                                    }
                                });
                                res.end();
                            }
                            else{
                                res.send({success: false, reason: 'no such user'})
                                res.end();
                            }
                        })
                    }
                });
        }
        else{
            res.end('<h1>Do not try that!');
        }
    },

    recoverUser: function (req, res, next) {

        //checks if id is valid
        if(!req.query.id){
            res.end('<h1>Not authorized access!');
            return;
        }
        if(req.query.id !== req.query.id.replace(/[^a-zA-Z0-9]/g, "") || req.query.id.length != 40){
            res.end('<h1>Do not try this at home!');
            return;
        }


        Users.findOne({randomIdForEmailConfirmation: req.query.id}).exec(function (err, user) {
            if (err){
                res.end("<h1>Error! Try again later");
                return;
            }
            if (user) {
                if ((req.protocol + "://" + req.get('host')) == ("http://" + user.host)) {
                    //console.log("Domain is matched. Information is from Authentic email");

                    //if pass is already recovered. Redirect to home page
                    if(user.passRecovered){
                        res.redirect('/');
                        return;
                    }

                    //If user is not yet confirmed
                    //Check the expiration date
                    var t = new Date();
                    if (t > user.expirationConfirmationTime) {

                        //If date expired send message for new sign up
                        res.end("<h1>Password recovery is too late!");
                        return;
                    }

                    //If user confirmation is OK go to update the user
                    res.render('index');
                }

                //if confirmation comes not from the genuine user's e-mail
                else {
                    res.end("<h1>Request is from unknown source");
                    return;
                }
            }
            //if user does not exist it DB
            else{
                res.end("<h1>No such user!");
                return;
            }
        })
    },

    verifyAndRecoverUser: function (req, res, next) {
        var newUser = req.body;
        //validates pass
        if (newUser.password != newUser.password.replace(/[^a-zA-Z0-9_<>?]/g, "")) {
            res.send({success: false, reason: 'Password contains forbidden symbols!'});
            res.end();
            return;
        }
        if (newUser.password.length > 16) {
            res.send({success: false, reason: 'Password is too long!'});
            res.end();
            return;
        }



        //TODO pass should not be recovered more than once
        var s = generateSalt()

        Users.findOneAndUpdate({randomIdForEmailConfirmation: newUser.id, passRecovered: false },{
            passRecovered : true,
            salt: s,
            hashPass: generateHashedPassword(s, newUser.password)

        }).exec(function (err, user) {
            if (err) {
                res.send({success: false, reason: 'Sorry, try again later!'});
                return;
            }
            if (user) {
                res.send({success: true, reason: 'OK'});
                res.end();
            }
            else {
                res.send({success: false, reason: 'Sorry, this user has been updated already!'})
                res.end();
            }
        })
    }



  };


