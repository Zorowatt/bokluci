var Users = require('mongoose').model('Users')
    ,crypto = require('crypto')//this is an encryption module included in node.js
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
                //gets client IP
                var ipAddr = req.headers["x-forwarded-for"];
                if (ipAddr){
                    var list = ipAddr.split(",");
                    ipAddr = list[list.length-1];
                } else {
                    ipAddr = req.connection.remoteAddress;
                }
               // console.log(newUser);
                newUser.salt = generateSalt();
                newUser.hashPass = generateHashedPassword(newUser.salt, newUser.password);
                newUser.confirmedEmail = false; //this is to verify user after it's confirmation e-mail
                newUser.randomIdForEmailConfirmation = randomString(40); //Creates random token for user confirmation during E-mail exchange
                var t = new Date();
                newUser.expirationConfirmationTime = t.setHours(t.getHours()+24); //sets expiration Date and time
                newUser.host = req.get('host');
                newUser.passRecovered = true;
                newUser.registrationDetails=[{date:t, ipAddress:ipAddr}];

                // TODO if invalid e-mail has being sent
                //console.log(ipAddr);
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
            res.redirect('/');
           // res.end('<h1>Not authorized access!');
            return;
        }
        if(req.query.id !== req.query.id.replace(/[^a-zA-Z0-9]/g, "") || req.query.id.length != 40){
            res.redirect('/');
            //res.end('<h1>Do not try this at home!');
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
                        user.passRecovered = true;
                        user.save();
                        //If date expired send message for new sign up
                        res.end("<h1>Password recovery is too late!");
                        return;
                    }

                    //If user confirmation is OK go to update the user
                    res.render('index');
                }

                //if confirmation comes not from the genuine user's e-mail
                else {
                    res.redirect('/');
                    //res.end("<h1>Request is from unknown source");
                    return;
                }
            }
            //if user does not exist it DB
            else{
                res.redirect('/');

            }
        })
    },

    verifyAndRecoverUser: function (req, res, next) {
        var newUser = req.body;
        //console.log(newUser);
        if (!newUser.password){
            //thi is a fake OK
            res.send({success: true, reason: 'OK'});
            //res.send({success: false, reason: 'BAD request!'})
            res.end();
//            res.end('<h1>Bad Request!');
//            return;
        }
        if (newUser.password.length == 0){
            //thi is a fake OK
            res.send({success: true, reason: 'OK'});
            //res.send({success: false, reason: 'BAD request!'})
            res.end();


//            res.send({success: false, reason: 'Password contains fodden symbols!'});
//            res.end();
//            return;
        }


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
        var s = generateSalt();

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
                //thi is a fake OK
                res.send({success: true, reason: 'OK'});
                //res.send({success: false, reason: 'Sorry, this user has been updated already!'})
                res.end();
            }
        })
    }

  };


