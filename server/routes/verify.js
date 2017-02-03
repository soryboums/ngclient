var User = require('../models/user');
var jwt = require('jsonwebtoken');

var config = require('../config');

exports.getToken = function(user){
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600
  });
};

exports.verifyOrdinaryUser = function(req, res, next){
  // Check header or url params or post params for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token){
    // Verifies secret and checks exp
    jwt.verify(token, config.secretKey, function(err, decoded){
      if (err) {
        var err = new Error('You are not authenticated!');
          err.status = 401;
            return next(err);
          } else {
            req.decoded = decoded;
            next();
          }
    });
  } else {
    var err = Error('No token provided');
    err.status = 403;
      return next(err);
  }
};
