const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { body, validationResult } = require('express-validator');


/*
* GET register page
*/
router.get('/register' , (req, res)=>{
   res.render('page/register' , {
      title: 'Register',
      name:'',
      email:'',
      username:''
   });
});

/*
* POST register page
*/
router.post('/register' , [
      body('name' ,'Name field is required').not().isEmpty(), 
      body('username' ,'Username field is required').not().isEmpty(),
      body('email' ,'Email field is required').not().isEmpty(),
      body('password' ,'Please Enter a password').not().isEmpty(),
      body('password2').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
      }
                     return true;
        })

  ] ,(req, res)=>{

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

      
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      
      const error = errors.array();
        res.render('page/register', {
            title: 'Register',
            error: error ,
            user: null ,
            name: name ,
            email: email ,
            username: username
        });

  }else{
      User.findOne({ username: username } , (err , user)=>{
       if(err) console.log(err);
       if(user){
              req.flash('danger' , 'Username exists , try anotherone')
              res.redirect('/users/register');
       }else{
              var user = new User({
                name: name ,
                email: email,
                username: username,
                password: password,
                admin: 0
              });
        bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
           if(err) console.log(err);
           user.password = hash;
        user.save((e)=>{
          if(err) { 
            console.log(err)
          }else{
              req.flash('success' , 'Registration successful')
              res.redirect('/users/login');
          }
        });        
   });
});

       }

      });
     
  }
});


/*
* GET login page
*/
router.get('/login' , (req, res)=>{
  if(res.locals.user) return res.redirect('/');
   res.render('page/login' , {
      title: 'Login',
   });
});

/*
* Post login page
*/
router.post('/login' , (req, res , next)=>{
   passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: true })(req , res , next);

      delete req.session.cart ;

});

/*
* Get logout
*/
router.get('/logout' , (req, res)=>{

  req.logout();
  delete req.session.cart ;
   req.flash('success' , 'You are Logged out')
              res.redirect('/users/login');
});




module.exports = router;