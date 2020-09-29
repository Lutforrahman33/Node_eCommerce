const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = function (passport) {
 
 passport.use(new LocalStrategy(function (username , password , done) {
  User.findOne({ username: username } , (err , user)=>{
      if(err)
         console.log(err);
      if(!user) 
         return done(null , false , {message: 'No user Found'});

  bcrypt.compare(password , user.password , (err , isMatch)=>{
       if(err) console.log(err);

       if(isMatch){
        return done(null , user);
       }else{
        return done(null , false , {message: 'Wrong Password'});
       }        
       });

  });

 }));

  passport.serializeUser(function(user, done) {
     done(null, user.id);
});

  passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
            done(err, user);
    });
});

}