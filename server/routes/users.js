var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

var userRouter = express.Router();

userRouter.route('/register')

.post(function(req, res){
  User.register(new User({username: req.body.username}),
  req.body.password, function(err, user){
    if (err) {
      return res.status(500).json({err: err});
    }

    if (req.body.firstname){
      user.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      user.lastname = req.body.lastname;
    }
    if (req.body.mail) {
      user.mail = req.body.mail;
    }

    user.save(function(err, user){
      passport.authenticate('local')(req, res, function(){
        return res.status(200).json({status: 'Registered successfully!'});
      });
    });

  });
})

// API to return the information on the current logged user
userRouter.route('/current')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  // Get user infos from the request
  user = {
    username: req.decoded._doc.username,
    lastname: req.decoded._doc.lastname,
    firstname: req.decoded._doc.firstname,
    mail: req.decoded._doc.mail
  };
  res.json(user);
})

userRouter.route('/login')

.post(function(req, res, next){
  passport.authenticate('local', function(err, user, info){
    if (err) {
      return next(err);
    }
    if (!user){
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err){
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successfully',
        success: true,
        token: token
      });
    });
  })(req, res, next);
})

userRouter.route('/logout')

.get(function(req, res){
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = userRouter;
